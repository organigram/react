import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { secondsToHms } from '../../utils';
import { ElectionComponent } from './Election';
const VoteProcedureComponent = ({ procedure }) => {
    const { t } = useTranslation();
    return procedure ? (_jsxs("div", { className: 'procedure-vote', children: [t('Quorum Size'), ": ", procedure.quorumSize.toString(), _jsx("br", {}), t('Vote Duration'), ": ", secondsToHms(parseInt(procedure.voteDuration)), _jsx("br", {}), t('Majority Size'), ": ", procedure.majoritySize.toString()] })) : (_jsx(_Fragment, {}));
};
const vote = {
    Proposal: ElectionComponent,
    Component: VoteProcedureComponent
};
export default vote;
