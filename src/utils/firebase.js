var firebaseConfig = {
  apiKey: "AIzaSyDEsAz0oLPwZ-JQbDGGnq3CQAJK1d7714k",
  authDomain: "personalproject-33263.firebaseapp.com",
  projectId: "personalproject-33263",
  storageBucket: "personalproject-33263.appspot.com",
  messagingSenderId: "966021952087",
  appId: "1:966021952087:web:5c52cfb31b031cdf6a6912",
  measurementId: "G-MXQWY9WWZK",
};
// Initialize Firebase
window.firebase.initializeApp(firebaseConfig);
const db = window.firebase.firestore();

const getActivityData = async () => {
  const activityData = db.collection("activityData");
  const allActivities = [];

  await activityData.get().then((d) => {
    d.forEach((data) => {
      allActivities.push(data.data());
    });
  });
  return allActivities;
};

const getSpecificData = async (id) => {
  let docRef = db.collection("activityData").doc(id);
  const data = await docRef.get().then((data) => {
    return data.data();
  });
  return data;
};

const deleteActivityData = async (id) => {
  let docRef = db.collection("activityData").doc(id);
  docRef.delete().then(() => {});
};

const uploadImage = async (img) => {
  const path = img.name;

  // 取得 storage 對應的位置
  const storageReference = window.firebase.storage().ref(path);
  // .put() 方法把東西丟到該位置裡
  const task = await storageReference.put(img);
  const fileRef = window.firebase.storage().ref(path);

  let downloadUrl = await fileRef.getDownloadURL().then(function (url) {
    return url;
  });
  return downloadUrl;
};

// const createActivity = async (data) => {
//   const activityData = db.collection("activityData").doc();
//   await activityData.set(data);
// };

const joinActivity = async (activityId, userId) => {
  let docRef = db.collection("activityData").doc(activityId);
  //firebase update方法
  const data = await docRef
    .update({
      applicants: window.firebase.firestore.FieldValue.arrayUnion(userId),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const agreeJoinActivity = async (activityId, userId) => {
  let docRef = db.collection("activityData").doc(activityId);
  //firebase update方法
  const data = await docRef
    .update({
      applicants: window.firebase.firestore.FieldValue.arrayRemove(userId),
      attendants: window.firebase.firestore.FieldValue.arrayUnion(userId),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const kickActivity = async (activityId, userId) => {
  let docRef = db.collection("activityData").doc(activityId);
  const data = await docRef
    .update({
      attendants: window.firebase.firestore.FieldValue.arrayRemove(userId),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const getUserData = async (userId) => {
  let docRef = db.collection("userData").doc(userId);
  const userData = await docRef.get().then((data) => {
    return data.data();
  });

  return userData;
};
const newUser = async (userEmail, userUid, userInfo) => {
  let newCreate = db.collection("userData").doc(userUid);

  const data = await newCreate
    .set({
      email: userEmail,
      uid: userUid,
      name: userInfo.name,
      preferType: userInfo.preferType,
      skill: userInfo.skill,
      intro: "",
      profileImage: "",
      youtubeUrl: "",
    })
    .then(() => {
      console.log("create new user");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const updateUserData = async (newData, userId) => {
  let docRef = db.collection("userData").doc(userId);
  const data = await docRef
    .set(
      {
        name: newData.name,
        intro: newData.intro,
        preferType: newData.preferType,
        skill: newData.skill,
        //   intro: window.firebase.firestore.FieldValue.arrayUnion(newData.intro),
      },
      { merge: true }
    )
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const getUserHostActivities = async (userId) => {
  let docRef = db.collection("activityData");
  let hostActivitiesArray = [];
  const hostActivities = await docRef
    .where("host", "==", userId)
    .get()
    .then((data) => {
      data.forEach((item) => {
        hostActivitiesArray.push(item.data());
      });
    });
  return hostActivitiesArray;
};
const getUserJoinActivities = async (userId) => {
  let docRef = db.collection("activityData");
  let joinActivitiesArray = [];
  const joinActivities = await docRef
    .where("attendants", "array-contains", userId)
    .get()
    .then((data) => {
      data.forEach((item) => {
        joinActivitiesArray.push(item.data());
      });
    });
  return joinActivitiesArray;
};

const getUserApplyActivities = async (userId) => {
  let docRef = db.collection("activityData");
  let applyActivitiesArray = [];
  const applyActivities = await docRef
    .where("applicants", "array-contains", userId)
    .get()
    .then((data) => {
      data.forEach((item) => {
        applyActivitiesArray.push(item.data());
      });
    });
  return applyActivitiesArray;
};

const updateActivitiesData = async (data, activityId) => {
  let docRef = db.collection("activityData").doc(activityId);
  const activitiesData = await docRef
    .set(
      {
        title: data.title,
        type: data.type,
        limit: data.limit,
        // timestamp: data.timestamp,
        location: "AppWork School 3F",
        // geo: ["10", "10"],
        requirement: data.requirement,
        level: data.level,
        comment: data.comment,
        // youtubeSource: data.youtubeUrl,
        // fileSource: imageUrl,
        date: data.date,
        time: data.time,
      },
      { merge: true }
    )
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

export { getActivityData };
export { getSpecificData };
export { deleteActivityData };
export { joinActivity };
export { agreeJoinActivity };
export { kickActivity };
export { getUserData };
export { updateUserData };
export { newUser };
export { getUserHostActivities };
export { getUserJoinActivities };
export { getUserApplyActivities };
export { updateActivitiesData };
export { uploadImage };
// export { createActivity };
