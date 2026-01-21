import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { Organ } from '@organigram/js';
export const VoteEnded = ({ procedure, proposal, wrapTransaction }) => {
    const { t } = useTranslation();
    const election = procedure.elections?.find((b) => b.proposalKey && b.proposalKey === proposal.key);
    const [decidersCount, setDecidersCount] = React.useState(0);
    const quorum = Math.ceil((decidersCount * parseInt(procedure.quorumSize)) / 100000);
    useEffect(() => {
        const handler = async () => {
            const deciders = await Organ.load(procedure.deciders, procedure.provider);
            setDecidersCount(deciders.entries.filter(e => e.address != null && e.address !== '')
                .length);
        };
        handler();
    });
    return parseInt(election?.votesCount ?? '0') >= quorum &&
        election?.approved ? (_jsx(Button, { variant: 'contained', className: 'enact-proposal', fullWidth: true, onClick: () => {
            procedure
                .adoptProposal(proposal.key, { onTransaction: wrapTransaction })
                .catch((error) => console.error(error.message));
        }, children: t('Enact proposal') })) : (_jsx(Alert, { variant: 'filled', sx: { width: '100%' }, severity: 'info', children: t('Vote has ended with no decision.') }));
};
