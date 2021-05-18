const initialState = {
  userData: [],
  activityData: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_USERDATA":
      return { ...state, userData: action.data }; // 避免覆蓋 state
    case "UPDATE_ACTIVITYDATA":
      return { ...state, activityData: action.data };
    default:
      return state;
  }
}
