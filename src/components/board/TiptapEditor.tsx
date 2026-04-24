import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  Minus,
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { cn } from "@/components/ui/utils";
import { postService } from "@/apis/postService";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { useCallback, useRef, useMemo, useState } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { getProxiedImageUrl } from "@/utils/image";
import { ImageDto } from "@/apis/types/post.type";
import InputModal from "@/components/common/InputModal";
import { useAlert } from "@/contexts/AlertContext";

interface TiptapEditorProps {
  content: string;
  onChange: (value: string) => void;
  editable?: boolean;
  onUploadStateChange?: (isUploading: boolean) => void;
  onImageUploaded?: (image: ImageDto) => void;
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: (e: React.MouseEvent) => void;
  isActive?: boolean;
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors",
        isActive && "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white",
      )}
    >
      {children}
    </button>
  );
};

// Loading placeholder SVG for image uploads
const LOADING_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect width='200' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666' font-family='sans-serif' font-size='14'%3E업로드 중...%3C/text%3E%3C/svg%3E";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg", "image/png", "image/gif",
  "image/webp", "image/bmp", "image/svg+xml",
];
// SVG(벡터), WebP(이미 압축됨), GIF(애니메이션 보존) 는 변환 스킵
const NO_COMPRESS_TYPES = ["image/svg+xml", "image/webp", "image/gif"];
const COMPRESSION_OPTIONS = {
  fileType: "image/webp" as const,
  maxSizeMB: 5,
  initialQuality: 0.85,
  useWebWorker: true,
};

const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "이미지 파일만 업로드할 수 있습니다.\n(jpg, jpeg, png, gif, webp, bmp, svg)";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `파일 크기가 너무 큽니다.\n최대 15MB까지 업로드할 수 있습니다. (현재: ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
  }
  return null;
};

export default function TiptapEditor({
  content,
  onChange,
  editable = true,
  onUploadStateChange,
  onImageUploaded,
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploads = useRef(0);
  const { showAlert } = useAlert();

  // Store the initial content in a state to provide to the editor only once
  const [initialContent] = useState(content);

  // 링크 입력 모달 상태
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkDefaultValue, setLinkDefaultValue] = useState("");

  // useLatestRef로 stale closure 없이 최신 콜백 참조 유지
  const onChangeRef = useLatestRef(onChange);
  const onImageUploadedRef = useLatestRef(onImageUploaded);

  const updateUploadState = useCallback((increment: number) => {
    activeUploads.current += increment;
    onUploadStateChange?.(activeUploads.current > 0);
  }, [onUploadStateChange]);

  const uploadImage = useCallback(async (file: File) => {
    try {
      updateUploadState(1);
      // SVG, WebP는 변환 스킵. 나머지는 WebP로 압축 후 파일명도 .webp로 변경
      let fileToUpload: File = file;
      if (!NO_COMPRESS_TYPES.includes(file.type)) {
        const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
        fileToUpload = new File(
          [compressed],
          file.name.replace(/\.[^.]+$/, ".webp"),
          { type: "image/webp" }
        );
      }
      const response = await postService.uploadImage(fileToUpload);
      onImageUploadedRef.current?.(response);
      return getProxiedImageUrl(response.accessUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      showAlert("이미지 업로드에 실패했습니다.\n잠시 후 다시 시도해주세요.");
      return null;
    } finally {
      updateUploadState(-1);
    }
  }, [updateUploadState, showAlert]);



  // Helper function to replace image src in the editor
  const replaceImageSrc = useCallback(
    (editorInstance: Editor, oldSrc: string, newSrc: string) => {
      const { doc } = editorInstance.state;
      let pos = -1;

      doc.descendants((node: any, nodePos: number) => {
        if (node.type.name === "image" && node.attrs.src === oldSrc) {
          pos = nodePos;
          return false;
        }
      });

      if (pos !== -1) {
        if (newSrc) {
          // setNodeMarkup으로 selection을 변경하지 않고 src만 교체
          // (chain의 setNodeSelection + updateAttributes는 NodeSelection을 남겨 다음 키입력 시 이미지가 삭제됨)
          const { tr } = editorInstance.state;
          const node = editorInstance.state.doc.nodeAt(pos);
          if (node) {
            editorInstance.view.dispatch(
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: newSrc })
            );
          }
        } else {
          // Remove the placeholder if upload failed
          editorInstance.chain().focus().setNodeSelection(pos).deleteSelection().run();
        }
      }
    },
    [],
  );

  const extensions = useMemo(
    () => [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      Image.extend({ selectable: false }).configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder:
          "욕설, 불법 프로그램 홍보 등 커뮤니티 규정을 위반하는 게시물은 제재될 수 있습니다.",
      }),
    ],
    [],
  );

  const editor = useEditor({
    extensions,
    content: initialContent,
    editable,
    onUpdate: ({ editor: e }) => {
      onChangeRef.current(e.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[300px] px-4 py-3 text-gray-900 dark:text-white",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          const dropError = validateImageFile(file);
          if (dropError) { showAlert(dropError); return true; }
          if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
            event.preventDefault();

            // Insert loading placeholder immediately
            const { schema } = view.state;
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            if (coordinates) {
              const placeholderNode = schema.nodes.image.create({
                src: LOADING_PLACEHOLDER,
              });
              const transaction = view.state.tr.insert(
                coordinates.pos,
                placeholderNode,
              );
              view.dispatch(transaction);

              // Upload and replace placeholder with actual image
              uploadImage(file).then((url) => {
                if (url) {
                  replaceImageSrc(editor!, LOADING_PLACEHOLDER, url);
                } else {
                  replaceImageSrc(editor!, LOADING_PLACEHOLDER, "");
                }
              });
            }
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              const pastedFile = items[i].getAsFile();
              if (pastedFile) {
                const pasteError = validateImageFile(pastedFile);
                if (pasteError) { showAlert(pasteError); return true; }
              }
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                // Insert loading placeholder immediately
                const { schema } = view.state;
                const placeholderNode = schema.nodes.image.create({
                  src: LOADING_PLACEHOLDER,
                });
                const transaction =
                  view.state.tr.replaceSelectionWith(placeholderNode);
                view.dispatch(transaction);

                // Upload and replace placeholder with actual image
                uploadImage(file).then((url) => {
                  if (url) {
                    replaceImageSrc(editor!, LOADING_PLACEHOLDER, url);
                  } else {
                    replaceImageSrc(editor!, LOADING_PLACEHOLDER, "");
                  }
                });
              }
              return true;
            }
          }
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    if (!hasSelection) {
      showAlert("링크를 추가할 텍스트를 먼저 선택해주세요.");
      return;
    }

    const previousUrl = editor.getAttributes("link").href ?? "";
    setLinkDefaultValue(previousUrl);
    setLinkModalOpen(true);
  };

  const validateLinkUrl = (url: string): string | null => {
    if (url === "") return null;
    if (!/^https?:\/\//i.test(url)) {
      return "http:// 또는 https:// 로 시작하는 URL만 입력할 수 있습니다.";
    }
    return null;
  };

  const handleLinkConfirm = (url: string) => {
    setLinkModalOpen(false);

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileError = validateImageFile(file);
      if (fileError) {
        showAlert(fileError);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }
    if (file) {
      // Insert loading placeholder immediately
      editor.chain().focus().setImage({ src: LOADING_PLACEHOLDER }).run();

      // Upload and replace placeholder with actual image
      const url = await uploadImage(file);
      if (url) {
        replaceImageSrc(editor, LOADING_PLACEHOLDER, url);
      } else {
        replaceImageSrc(editor, LOADING_PLACEHOLDER, "");
      }
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 overflow-hidden bg-white dark:bg-brand-900">
      <InputModal
        open={linkModalOpen}
        title="링크 URL을 입력하세요."
        placeholder="https://example.com"
        defaultValue={linkDefaultValue}
        confirmLabel="적용"
        allowEmpty
        validate={validateLinkUrl}
        onConfirm={handleLinkConfirm}
        onCancel={() => setLinkModalOpen(false)}
      />
      {editable && (
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-300 dark:border-gray-600">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="굵게"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="기울임"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="밑줄"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="왼쪽 정렬"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="가운데 정렬"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="오른쪽 정렬"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="글머리 기호"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="번호 매기기"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="인용구"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            title="링크"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="이미지">
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="구분선"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center ml-auto" />
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="실행 취소"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="다시 실행"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>
      )}
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
