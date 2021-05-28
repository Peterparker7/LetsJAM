import "../../App.css";
import "../../normalize.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecificData } from "../../utils/firebase";
import { joinActivity } from "../../utils/firebase";
import { getUserData } from "../../utils/firebase";
import { getAuthUser } from "../../utils/firebase";

function Detail() {
  let { id } = useParams();
  // let userId = "vfjMHzp45ckI3o3kqDmO";
  const [detailData, setDetailData] = useState();
  const [currentUserData, setCurrentUserData] = useState();
  const [userUid, setUserUid] = useState();
  const [userName, setUserName] = useState();

  let activityDetail = {};

  //取得使用者資料
  window.firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // 使用者已登入，可以取得資料
      var email = user.email;
      var uid = user.uid;
      console.log(email, uid);
    } else {
      // 使用者未登入
    }
  });
  const checkUserIsLogin = async () => {
    const userUid = await getAuthUser();
    console.log(userUid);
    const userData = await getUserData(userUid);
    console.log(userData);
    setUserUid(userUid);
    setUserName(userData.name);
    console.log(userUid);
  };

  const getData = async () => {
    let data = await getSpecificData(id);

    //再打一次userData, 取得 host 的userData詳細資料，放進detailData 裡面以便之後取用
    const host = await getUserData(data.host);
    const currentUser = await getUserData(userUid);
    console.log(data);
    //打多次userData, 一次取得多個 applicants 的userData詳細資料，放進detailData 裡面以便之後取用
    const applicantsDetailArray = [];
    data.applicants.forEach((applicants) => {
      const promise = getUserData(applicants).then((data) => {
        return data;
      });
      applicantsDetailArray.push(promise);
    });
    const allApplicants = await Promise.all(applicantsDetailArray);
    //打多次userData, 一次取得多個 attendants 的userData詳細資料，放進detailData 裡面以便之後取用
    const attendantsDetailArray = [];
    data.attendants.forEach((attendants) => {
      const promise = getUserData(attendants).then((data) => {
        return data;
      });
      attendantsDetailArray.push(promise);
    });
    const allAttendants = await Promise.all(attendantsDetailArray);

    //把有detail的host & applicants塞到useState
    data.host = host;
    data.applicants = allApplicants;
    data.attendants = allAttendants;

    setDetailData(data);
    setCurrentUserData(currentUser);
  };

  console.log(detailData);
  //   const detailHTML = detailData.() => {
  //     return <div></div>;
  //   };

  const renderDetail = () => {
    console.log("??");
    let requirementHTML = detailData.requirement.map((item, index) => {
      return <span>{item} </span>;
    });
    let activityTime = detailData.timestamp.toDate().toString();
    console.log(activityTime.slice(0, 21));
    let showTime = activityTime.slice(0, 21);
    let limit = "";
    if (detailData.limit === 0) {
      limit = "無";
    } else {
      limit = detailData.limit;
    }

    return (
      <ActivityContainer>
        <ActivityDetail>
          <Title>{detailData.title}</Title>
          <ItemField>
            <InfoBar>
              <TypeItem>{detailData.type}</TypeItem>

              <Item>{showTime}</Item>
            </InfoBar>
            <InfoBarSecond>
              <CommentItem>{detailData.comment}</CommentItem>
              {/* <Item>{detailData.timestamp}</Item> */}
              <Item>需求樂器： {requirementHTML}</Item>
              <Item>適合程度： {detailData.level}</Item>
              <Item>人數限制： {limit}</Item>
              <Item>地點： {detailData.location}</Item>
              <div>{detailData.id}</div>
            </InfoBarSecond>
          </ItemField>
        </ActivityDetail>
        <ImageContainer>
          <ActivityImage
            src={`${detailData.fileSource}`}
            alt=""
          ></ActivityImage>
          <ButtonField>
            <ShareButton>分享活動</ShareButton>
            {renderJoinButton()}
          </ButtonField>
        </ImageContainer>
      </ActivityContainer>
    );
  };

  //   const userData = async () => {
  //     console.log("!!");
  //     let data = await getUserData(userId);
  //     console.log(data);
  //   };
  //   userData();

  const renderHost = () => {
    const renderVideo = () => {
      // if (detailData.youtubeSource) {
      //   const videoUrl = detailData.youtubeSource;
      //   const source = videoUrl.toString().slice(-11);
      //   const videoEmbedUrl = `https://www.youtube.com/embed/${source}?&autoplay=1&mute=1&loop=0&controls=1&rel=0" frameborder="1" allowfullscreen>`;
      //   return (
      //     <iframe
      //       width="500"
      //       height="315"
      //       src={videoEmbedUrl}
      //       title="YouTube video player"
      //     ></iframe>
      //   );
      // } else {
      //   return;
      // }
      if (detailData.host.youtubeUrl) {
        const videoUrl = detailData.host.youtubeUrl;
        const source = videoUrl.toString().slice(-11);
        const videoEmbedUrl = `https://www.youtube.com/embed/${source}?&autoplay=1&mute=1&loop=0&controls=1&rel=0" frameborder="1" allowfullscreen>`;
        return (
          <iframe
            width="500"
            height="315"
            src={videoEmbedUrl}
            title="YouTube video player"
          ></iframe>
        );
      } else {
        return;
      }
    };

    console.log(detailData.host.name);
    console.log(detailData.applicants);
    // const applicantsHTML = Object.values(detailData.applicants).map((data) => {
    //   console.log(data);
    //   console.log(data.name);
    //   return (
    //     <EachAttendantField>
    //       <ProfileBlock>
    //         <ProfileImg
    //           // src={`${data.profileImage}`}
    //           style={{
    //             background: `url(${data.profileImage})`,
    //             backgroundSize: "cover",
    //             backgroundPosition: "",
    //           }}
    //         />

    //         <div>{data.name}</div>
    //       </ProfileBlock>
    //     </EachAttendantField>
    //   );
    // });
    const attendantsHTML = Object.values(detailData.attendants).map((data) => {
      console.log(data);
      console.log(data.name);
      return (
        <EachAttendantField>
          <ProfileBlock>
            <ProfileImg
              // src={`${data.profileImage}`}
              style={{
                background: `url(${data.profileImage})`,
                backgroundSize: "cover",
                backgroundPosition: "",
              }}
            />

            <div>{data.name}</div>
          </ProfileBlock>
        </EachAttendantField>
      );
    });
    return (
      <MemberInfoContainer>
        <HostTitle>關於揪團主</HostTitle>
        <MemberHostField>
          <HostProfileBlock>
            <ProfileImg
              style={{
                background: `url(${detailData.host.profileImage})`,
                backgroundSize: "cover",
                backgroundPosition: "",
              }}
            />

            <div>{detailData.host.name}</div>
          </HostProfileBlock>
          <IntroBlock>{detailData.host.intro}</IntroBlock>
          <VideoBlock>{renderVideo()}</VideoBlock>
        </MemberHostField>
        <AttendantsTitle>出席成員</AttendantsTitle>
        <MemberField>{attendantsHTML}</MemberField>
      </MemberInfoContainer>
    );

    console.log(detailData.host);
  };
  const handleJoin = () => {
    console.log("join click!");

    joinActivity(id, userUid);

    // detailData Object {...detailData, applicants:[...detailData.applicants,{}]}

    // setData((data) => [...data, ...dataList]);   //append新東西到array
    // setData([...data, ...dataList]);   //會後面覆蓋前面的因為結構都依樣
    console.log(currentUserData);
    setDetailData({
      ...detailData,
      applicants: [
        ...detailData.applicants, //資料結構不同，才有辦法更新
        { name: userName, uid: userUid },
      ],
    });
  };
  const handleVisitor = () => {
    alert("登入以使用此功能");
  };

  const renderJoinButton = () => {
    const isApplicant = detailData.applicants.filter((item) => {
      console.log(userUid);
      console.log(item.uid);
      if (userUid && item.uid === userUid) {
        return item;
      }
    });
    const isAttendant = detailData.attendants.filter((item) => {
      if (userUid && item.uid === userUid) {
        return item;
      }
    });
    console.log(isApplicant);
    console.log(isAttendant);
    if (isApplicant.length !== 0) {
      return (
        <ApplicantButton
        // onClick={() => {
        //   handleJoin();
        // }}
        >
          申請中
        </ApplicantButton>
      );
    } else if (isAttendant.length !== 0) {
      return (
        <AttendantButton
        // onClick={() => {
        //   handleJoin();
        // }}
        >
          已加入
        </AttendantButton>
      );
    } else if (!userUid) {
      return (
        <JoinButton
          onClick={() => {
            handleVisitor();
          }}
        >
          我要報名
        </JoinButton>
      );
    } else if (detailData.host.uid === userUid) {
      console.log(detailData.host.uid);
      console.log(userUid);
      return (
        <JoinButton
          onClick={() => {
            handleJoin();
          }}
          disabled={true}
          style={{
            backgroundColor: "#ffffff4f",
            color: "#FFF",
            opacity: 0.5,
            cursor: "not-allowed",
          }}
        >
          我的活動
        </JoinButton>
      );
    } else {
      return (
        <JoinButton
          onClick={() => {
            handleJoin();
          }}
        >
          我要報名
        </JoinButton>
      );
    }
  };

  //useEffect只在第一次render後執行
  useEffect(() => {
    checkUserIsLogin();

    getData();
  }, [id]);

  //useEffect在每次detailData變化後執行
  //   useEffect(() => {
  //     renderDetail();
  //   }, [detailData]);

  //防止第一次render抓不到東西，先return null跳出 (幫下面的renderDetail擋避免undifine)
  if (!detailData) {
    return "isLoading";
  }
  console.log(detailData);
  return (
    <DetailContent>
      {renderDetail()}
      {/* <JoinButton
        onClick={() => {
          handleJoin();
        }}
      >
        我要報名
      </JoinButton> */}
      {/* {renderJoinButton()} */}
      {renderHost()}
    </DetailContent>
  );
}

const DetailContent = styled.div`
  height: 100%;
  padding-bottom: 180px;
  background: #000;
`;
const ActivityContainer = styled.div`
  width: 1024px;
  display: flex;
  margin: 0px auto;
  padding-top: 50px;
  justify-content: space-between;
  border: 1px solid;
`;
const ActivityDetail = styled.div`
  width: 480px;
  text-align: left;
  margin-right: 20px;
`;
const Title = styled.div`
  font-size: 28px;
  border-bottom: 1px solid #979797;
  color: #fff;
`;
const ItemField = styled.div`
  padding-left: 10px;
`;

const InfoBar = styled.div`
  line-height: 20px;
  color: #979797;
`;
const InfoBarSecond = styled.div`
  margin-top: 20px;
  line-height: 40px;
  color: #fff;
`;

const CommentItem = styled.div`
  padding-left: 40px;
  padding-right: 40px;
  margin: 20px auto;
  line-height: 30px;
`;
const TypeItem = styled.div``;
const Item = styled.div`
  width: 100%;
`;
const ImageContainer = styled.div`
  width: calc(100% - 480px);
  /* width: 600px; */
  margin-top: 40px;
`;
const ActivityImage = styled.img`
  width: 100%;
`;
const ButtonField = styled.div`
  margin-top: 20px;
  text-align: right;
`;

const Btn = styled.button`
  border: 1px solid #979797;
  border-radius: 10px;
  width: 150px;
  height: 50px;
  cursor: pointer;
  color: #fff;
`;
const ShareButton = styled(Btn)`
  margin-right: 20px;
`;
const JoinButton = styled(Btn)``;
const ApplicantButton = styled(Btn)`
  cursor: not-allowed;
`;
const AttendantButton = styled(Btn)`
  cursor: not-allowed;
`;

const MemberInfoContainer = styled.div`
  width: 1024px;
  margin: 80px auto;
  text-align: left;
  color: #fff;
`;
const MemberField = styled.div`
  padding: 0 40px;
  width: 100%;
  display: flex;
`;
const MemberHostField = styled.div`
  padding: 10px 40px;
  width: 100%;
  display: flex;
  padding-right: 0px;
`;
const ProfileBlock = styled.div`
  text-align: center;
  margin: 20px 20px;
`;
const HostProfileBlock = styled.div`
  margin: auto 20px;
  margin-right: 0px;
  text-align: center;
  margin: 20px 20px;
`;
const IntroBlock = styled.div`
  width: 300px;
  padding: 20px;
  align-items: center;
  margin: auto;
  line-height: 2;
  word-wrap: break-word;
`;
const VideoBlock = styled.div``;
const HostTitle = styled.div`
  font-size: 24px;
  border-bottom: 1px solid #979797;
`;

const EachAttendantField = styled.div``;
const AttendantsTitle = styled.div`
  font-size: 24px;
  border-bottom: 1px solid #979797;
`;
const ProfileImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`;
export default Detail;
