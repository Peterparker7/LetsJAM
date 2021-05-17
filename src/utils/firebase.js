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
  docRef.delete().then(() => {
    console.log(`delete activity ${id}`);
  });
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
    .then(() => {
      console.log(`update applicants ${userId} to firebase`);
    })
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
    .then(() => {
      console.log(`update attendants ${userId} to firebase`);
    })
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
    .then(() => {
      console.log(`remove attendants ${userId} from firebase`);
    })
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
    .then(() => {
      console.log(`update ${userId} userData to firebase`);
    })
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
        console.log(item.data());
        hostActivitiesArray.push(item.data());
      });
    });
  console.log(hostActivitiesArray);
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
        console.log(item.data());
        joinActivitiesArray.push(item.data());
      });
    });
  console.log(joinActivitiesArray);
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
        console.log(item.data());
        applyActivitiesArray.push(item.data());
      });
    });
  console.log(applyActivitiesArray);
  return applyActivitiesArray;
};

export { getActivityData };
export { getSpecificData };
export { deleteActivityData };
export { joinActivity };
export { agreeJoinActivity };
export { kickActivity };
export { getUserData };
export { updateUserData };
export { getUserHostActivities };
export { getUserJoinActivities };
export { getUserApplyActivities };
export { uploadImage };
// export { createActivity };
