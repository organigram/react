import { Organigram } from '@organigram/js';
export declare const useOrganigram: ({ initOrganigram, options }: {
    initOrganigram?: Organigram;
    options?: any;
}) => {
    currentOrganigram: Organigram | null;
    setCurrentOrganigram: import('react').Dispatch<import('react').SetStateAction<Organigram | null>>;
    deploy: () => Promise<void>;
};
