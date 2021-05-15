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

export { getActivityData };
export { getSpecificData };
export { joinActivity };
export { getUserData };
export { updateUserData };
export { uploadImage };
// export { createActivity };
