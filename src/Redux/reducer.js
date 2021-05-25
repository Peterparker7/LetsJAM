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
      return {
        ...state,
        // userHostActivityData: [...state.userHostActivityData, ...action.data],
        userHostActivityData: [...action.data], //上面的方式會重複
      };
    case "UPDATE_ONEUSERHOSTACTIVITYDATA": {
      //function 需用{}包起來
      //dispatch時必須帶入id追蹤
      const id = action.data.id;

      const index = state.userHostActivityData.findIndex(
        (data) => data.id === id
      );
      const newData = [...state.userHostActivityData];
      newData[index] = action.data;

      return {
        ...state,
        // userHostActivityData: ()=> [action.data, ...state.userHostActivityData],
        userHostActivityData: newData,
      };
    }
    case "DELETE_ACTIVITYDATA": {
      const dataToDelete = action.data;

      return {
        ...state,
        userHostActivityData: state.userHostActivityData.filter((item) => {
          return item.id !== dataToDelete.id;
        }),
      };
    }
    default:
      return state;
  }
}
