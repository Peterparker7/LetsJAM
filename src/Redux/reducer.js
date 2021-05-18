const initialState = {
  userData: [],
  activityData: [],
  userHostActivityData: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_USERDATA":
      return { ...state, userData: action.data }; // 避免覆蓋 state
    case "UPDATE_ACTIVITYDATA":
      return { ...state, activityData: action.data };
    case "UPDATE_USERHOSTACTIVITYDATA":
      return { ...state, userHostActivityData: action.data };
    // case "DELETE_ACTIVITYDATA":
    //   return { ...state, userHostActivityData: state.userHostActivityData.splice(item.index, 1)};
    default:
      return state;
  }
}
