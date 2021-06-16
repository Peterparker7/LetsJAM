import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
// var firebaseConfig = {
//   // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   apiKey: "AIzaSyDEsAz0oLPwZ-JQbDGGnq3CQAJK1d7714k",
//   authDomain: "personalproject-33263.firebaseapp.com",
//   projectId: "personalproject-33263",
//   storageBucket: "personalproject-33263.appspot.com",
//   messagingSenderId: "966021952087",
//   appId: "1:966021952087:web:5c52cfb31b031cdf6a6912",
//   measurementId: "G-MXQWY9WWZK",
// };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
  const storageReference = firebase.storage().ref(path);

  // .put() 方法把東西丟到該位置裡
  // const task = await storageReference.put(img);
  await storageReference.put(img);
  const fileRef = firebase.storage().ref(path);

  let downloadUrl = await fileRef.getDownloadURL().then(function (url) {
    return url;
  });

  return downloadUrl;
};

const joinActivity = async (activityId, userId) => {
  let docRef = db.collection("activityData").doc(activityId);
  //firebase update方法
  await docRef
    .update({
      applicants: firebase.firestore.FieldValue.arrayUnion(userId),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const agreeJoinActivity = async (activityId, userId) => {
  let docRef = db.collection("activityData").doc(activityId);
  //firebase update方法
  await docRef
    .update({
      applicants: firebase.firestore.FieldValue.arrayRemove(userId),
      attendants: firebase.firestore.FieldValue.arrayUnion(userId),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const kickActivity = async (activityId, userId) => {
  let docRef = db.collection("activityData").doc(activityId);
  await docRef
    .update({
      attendants: firebase.firestore.FieldValue.arrayRemove(userId),
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

const getAllUser = async () => {
  let docRef = db.collection("userData");
  let allUser = [];
  await docRef.get().then((d) => {
    d.forEach((data) => {
      allUser.push(data.data());
    });
  });
  return allUser;
};

const getAuthUser = async () => {
  const promise = new Promise((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
      unsubscribe();
      if (user) {
        // 使用者已登入，可以取得資料
        var email = user.email;
        var uid = user.uid;
        console.log(email, uid);
        resolve(uid);
      } else {
        // 使用者未登入
        console.log("you are not login");
        resolve(false);
      }
    });
  });
  let response = await promise;
  return response;
};

const logOut = async () => {
  firebase
    .auth()
    .signOut()
    .then(function () {})
    .catch(function (error) {
      console.log(error.message);
    });
};
const newUser = async (userEmail, userUid, userInfo) => {
  let newCreate = db.collection("userData").doc(userUid);

  await newCreate
    .set({
      email: userEmail,
      uid: userUid,
      name: userInfo.name,
      preferType: userInfo.preferType,
      skill: userInfo.skill,
      invitation: [],
      intro: "",
      profileImage:
        "https://firebasestorage.googleapis.com/v0/b/personalproject-33263.appspot.com/o/istockphoto-1246254218-612x612.jpg?alt=media&token=2c69d8b3-25e8-46e7-a85d-1371db23086c",
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
  await docRef
    .set(
      {
        name: newData.name,
        intro: newData.intro,
        preferType: newData.preferType,
        skill: newData.skill,
        profileImage: newData.profileImage,
        youtubeUrl: newData.youtubeUrl,
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
  await docRef
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
  await docRef
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
  await docRef
    .where("applicants", "array-contains", userId)
    .get()
    .then((data) => {
      data.forEach((item) => {
        applyActivitiesArray.push(item.data());
      });
    });
  return applyActivitiesArray;
};

const cancelJoinActivities = async (activityId, userId) => {
  let docRef = db.collection("activityData").doc(activityId);
  docRef
    .update({
      applicants: firebase.firestore.FieldValue.arrayRemove(userId),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  docRef
    .update({
      attendants: firebase.firestore.FieldValue.arrayRemove(userId),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const updateActivitiesData = async (data, activityId) => {
  let docRef = db.collection("activityData").doc(activityId);
  await docRef
    .set(
      {
        title: data.title,
        type: data.type,
        limit: data.limit,
        newTimestamp: data.newTimestamp,
        timestamp: data.newTimestamp,
        location: data.location,
        requirement: data.requirement,
        level: data.level,
        comment: data.comment,
        youtubeSource: data.youtubeSource,
        date: data.date,
        time: data.time,
      },
      { merge: true }
    )
    .then(() => {
      console.log("update to firebase");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};
const sendUserInvite = async (inviteInfo, userId) => {
  let docRef = db.collection("userData").doc(userId);
  await docRef
    .update({
      invitation: firebase.firestore.FieldValue.arrayUnion(inviteInfo),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};
const updateInvitation = async (newInviteArray, userId) => {
  let docRef = db.collection("userData").doc(userId);
  await docRef
    .set(
      {
        invitation: newInviteArray,
      },
      { merge: true }
    )
    .then(() => {})
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

const subscribe = (callback, activityId) => {
  const unsubscribe = db
    .collection("activityData")
    .doc(activityId)
    .onSnapshot((doc) => {
      callback(doc.data());
    });
  return unsubscribe;
};
const subscribeUser = (callback, userId) => {
  const unsubscribe = db
    .collection("userData")
    .doc(userId)
    .onSnapshot((doc) => {
      callback(doc.data());
    });
  return unsubscribe;
};

export { getActivityData };
export { getSpecificData };
export { deleteActivityData };
export { joinActivity };
export { agreeJoinActivity };
export { kickActivity };
export { getUserData };
export { getAllUser };
export { getAuthUser };
export { logOut };
export { updateUserData };
export { newUser };
export { getUserHostActivities };
export { getUserJoinActivities };
export { getUserApplyActivities };
export { cancelJoinActivities };
export { updateActivitiesData };
export { uploadImage };
export { sendUserInvite };
export { updateInvitation };
export { subscribe };
export { subscribeUser };
// export { createActivity };
