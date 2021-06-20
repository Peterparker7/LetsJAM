import "@testing-library/jest-dom/extend-expect";

import reducer from "./reducer";

describe("reducer", () => {
  it("should initialize with correct initial state", () => {
    const state = undefined;
    const action = {};
    const nextState = reducer(state, action);
    expect(nextState).toEqual({
      userData: [],
      activityData: [],
      userHostActivityData: [],
      userJoinActivityData: [],
    });
  });

  it("should handle delete activity data", () => {
    const state = {
      userData: [],
      activityData: [],
      userHostActivityData: [
        {
          id: 123,
        },
        { id: 456 },
      ],
      userJoinActivityData: [],
    };

    const nextState = reducer(state, {
      type: "DELETE_ACTIVITYDATA",
      data: {
        id: 456,
      },
    });
    expect(nextState).toEqual({
      userData: [],
      activityData: [],
      userHostActivityData: [
        {
          id: 123,
        },
      ],
      userJoinActivityData: [],
    });
  });
});
