import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { secondsToHms } from '../../utils';
import { useTranslation } from 'react-i18next';
import { ElectionComponent } from './Election';
const ERC20VoteProcedureComponent = ({ procedure }) => {
    const { t } = useTranslation();
    const [erc20Balance, setErc20Balance] = React.useState('0');
    React.useEffect(() => {
        const handler = () => {
            procedure.erc20Balance().then(balance => {
                setErc20Balance(balance.toString());
            });
        };
        handler();
    });
    return procedure ? (_jsxs("div", { className: 'procedure-vote', children: [t('Voters Organ'), ": ", _jsx("code", { children: procedure.deciders }), _jsx("br", {}), t('Veto Organ'), ": ", _jsx("code", { children: procedure.moderators }), _jsx("br", {}), t('ERC20 Token contract'), ": ", _jsx("code", { children: procedure.erc20 }), _jsx("br", {}), t('ERC20 Token balance'), ": ", _jsx("code", { children: erc20Balance }), _jsx("br", {}), t('Quorum Size'), ": ", procedure.quorumSize.toString(), _jsx("br", {}), t('Vote Duration'), ": ", secondsToHms(parseInt(procedure.voteDuration)), _jsx("br", {}), t('Majority Size'), ": ", procedure.majoritySize.toString()] })) : (_jsx(_Fragment, {}));
};
const erc20Vote = {
    Component: ERC20VoteProcedureComponent,
    Proposal: ElectionComponent
};
export default erc20Vote;
