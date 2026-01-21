import { jsx as _jsx } from "react/jsx-runtime";
import Button from '@mui/material/Button';
export const VetoProposal = ({ accountInOrgans, procedure, proposal, wrapTransaction, t }) => {
    return accountInOrgans?.moderators ? (_jsx(Button, { color: 'secondary', variant: 'contained', fullWidth: true, className: 'veto-proposal', onClick: () => {
            procedure
                .blockProposal(proposal.key, '', {
                onTransaction: wrapTransaction
            })
                .catch((error) => console.error(error.message));
        }, children: t('Veto proposal') })) : null;
};
