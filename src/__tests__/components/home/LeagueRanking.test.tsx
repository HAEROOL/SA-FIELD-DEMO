
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import LeagueRanking from '@/components/home/LeagueRanking';
import { renderWithProviders } from '../../utils/test-utils';
import * as useLeagueHook from '@/hooks/queries/useLeague';

// Mock useLeagueTop
vi.mock('@/hooks/queries/useLeague', () => ({
  useLeagueTop: vi.fn(),
}));

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('LeagueRanking (Home) Component', () => {
    it('renders clan ranking with logos', () => {
        const mockData = {
            topRankings: {
                "1": [
                    {
                        clanId: 1,
                        clanName: 'Test Clan 1',
                        ladderPoints: 1000,
                        clanMarkUrl: 'http://example.com/mark1.png',
                        clanBackMarkUrl: 'http://example.com/back1.png',
                    },
                    {
                        clanId: 2,
                        clanName: 'Test Clan 2',
                        ladderPoints: 900,
                        clanMarkUrl: null,
                        clanBackMarkUrl: null,
                    }
                ]
            }
        };

        vi.spyOn(useLeagueHook, 'useLeagueTop').mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
        } as any);

        renderWithProviders(<LeagueRanking />);

        expect(screen.getByText('Test Clan 1')).toBeInTheDocument();
        // We can check for the logo by alt text or just presence of image if ClanLogo renders it efficiently
        // Since ClanLogo uses next/image which renders an img with alt text
        expect(screen.getByAltText('Test Clan 1 로고')).toBeInTheDocument();
        expect(screen.getByText('Test Clan 2')).toBeInTheDocument();
    });
});
