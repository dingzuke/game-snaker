import { connect } from 'react-redux';
export default (mapStateToProp, act) => {
    return (target) => (
        connect(mapStateToProp, act)(target)
    );
};