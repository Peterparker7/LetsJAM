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

export { getActivityData };
export { uploadImage };
