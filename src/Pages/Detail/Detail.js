import "../../App.css";
import "../../normalize.css";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecificData } from "../../utils/firebase";
import { joinActivity } from "../../utils/firebase";
import { getUserData } from "../../utils/firebase";
import { getAuthUser } from "../../utils/firebase";
import MemberCard from "./MemberCard";
import Modal, { ModalProvider, BaseModalBackground } from "styled-react-modal";

const StyledModal = Modal.styled`
width: 20rem;
height: 20rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: white;
opacity: ${(props) => props.opacity};
transition : all 0.3s ease-in-out;`;

function Detail() {
  let { id } = useParams();
  // let userId = "vfjMHzp45ckI3o3kqDmO";
  const [detailData, setDetailData] = useState();
  const [currentUserData, setCurrentUserData] = useState();
  const [userUid, setUserUid] = useState();
  const [userName, setUserName] = useState();
  const [activityStatus, setActivityStatus] = useState(true);

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

    let newFormatDate = new Date(`${data.date}T${data.time}`);
    let nowDate = Date.now();
    if (newFormatDate < nowDate) {
      setActivityStatus(false);
    }
  };

  console.log(detailData);
  //   const detailHTML = detailData.() => {
  //     return <div></div>;
  //   };
  const handleShareClick = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${window.location}`,
      "mywin",
      "menubar=1,resizable=1,width=500,height=500"
    );
  };

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

    let date = detailData.date;
    let time = detailData.time;
    let newFormatDate = new Date(`${date}T${time}`);
    let nowDate = Date.now();
    let activityCloseTitleHTML = () => {
      if (newFormatDate < nowDate) {
        // setActivityStatus(false);
        return <CloseTitle>活動已結束</CloseTitle>;
      }
    };

    return (
      <ActivityContainer>
        <UpField>
          <ActivityDetail>
            <TitleContainer>
              <Title>
                {detailData.title}
                {activityCloseTitleHTML()}
              </Title>
            </TitleContainer>
            <ItemField>
              <InfoBar>
                <TypeItem>{detailData.type}</TypeItem>

                <Item>{showTime}</Item>
              </InfoBar>
              <InfoBarSecond>
                {/* <CommentItem>{detailData.comment}</CommentItem> */}
                {/* <Item>{detailData.timestamp}</Item> */}
                <Item>需求樂器： {requirementHTML}</Item>
                <Item>適合程度： {detailData.level}</Item>
                <Item>人數限制： {limit}</Item>
                <Item>地點： {detailData.location}</Item>
                <div>{detailData.id}</div>
              </InfoBarSecond>
            </ItemField>
            <RWDButtonField>
              <RWDShareButton
                disabled={!activityStatus}
                onClick={() => {
                  handleShareClick();
                }}
                style={
                  !activityStatus
                    ? {
                        background: "grey",
                        cursor: "not-allowed",
                        opacity: "0.5",
                      }
                    : {}
                }
              >
                分享活動
              </RWDShareButton>
              {renderJoinButton()}
            </RWDButtonField>
          </ActivityDetail>

          <ImageContainer>
            <ActivityImage
              src={`${detailData.fileSource}`}
              alt=""
            ></ActivityImage>
            <ButtonField>
              <ShareButton
                disabled={!activityStatus}
                onClick={() => {
                  handleShareClick();
                }}
                style={
                  !activityStatus
                    ? {
                        background: "grey",
                        cursor: "not-allowed",
                        opacity: "0.5",
                      }
                    : {}
                }
              >
                分享活動
              </ShareButton>
              {renderJoinButton()}
            </ButtonField>
          </ImageContainer>
        </UpField>
        <CommentField>
          <CommentTitle>活動描述</CommentTitle>
          <CommentItem>{detailData.comment}</CommentItem>
        </CommentField>
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
          <VideoIframe
            // width="500"
            // height="315"
            src={videoEmbedUrl}
            title="YouTube video player"
          ></VideoIframe>
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
              src={`${data.profileImage}`}
              // style={{
              //   background: `url(${data.profileImage})`,
              //   backgroundSize: "cover",
              //   backgroundPosition: "",
              // }}
            />

            <div>{data.name}</div>
            <MemberCard data={data} />
          </ProfileBlock>
        </EachAttendantField>
      );
    });
    return (
      <MemberInfoContainer>
        <HostTitle>關於揪團主</HostTitle>
        <MemberHostField>
          <ImageIntroBlock>
            <HostProfileBlock>
              <ProfileImg
                // style={{
                //   background: `url(${detailData.host.profileImage})`,
                //   backgroundSize: "cover",
                //   backgroundPosition: "",
                // }}
                src={detailData.host.profileImage}
              />

              <div>{detailData.host.name}</div>
              <MemberCard data={detailData.host} />
            </HostProfileBlock>
            <IntroBlock>{detailData.host.intro}</IntroBlock>
          </ImageIntroBlock>
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
          disabled={!activityStatus}
          style={
            !activityStatus
              ? {
                  background: "grey",
                  cursor: "not-allowed",
                  opacity: "0.5",
                }
              : {}
          }
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
          disabled={!activityStatus}
          style={
            !activityStatus
              ? {
                  background: "grey",
                  cursor: "not-allowed",
                  opacity: "0.5",
                }
              : {}
          }
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
          disabled={!activityStatus}
          onClick={() => {
            handleVisitor();
          }}
          style={
            !activityStatus
              ? {
                  background: "grey",
                  cursor: "not-allowed",
                  opacity: "0.5",
                }
              : {}
          }
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
          style={
            !activityStatus
              ? {
                  background: "grey",
                  cursor: "not-allowed",
                  opacity: "0.5",
                }
              : {}
          }
          disabled={!activityStatus}
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
    <ModalProvider backgroundComponent={FadingBackground}>
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
    </ModalProvider>
  );
}

const FadingBackground = styled(BaseModalBackground)`
  opacity: ${(props) => props.opacity};
  transition: all 0.3s ease-in-out;
`;

const DetailContent = styled.div`
  height: 100%;
  padding-bottom: 180px;
  background: #000;
`;
const ActivityContainer = styled.div`
  width: 1024px;
  /* display: flex; */
  margin: 0px auto;
  padding-top: 50px;
  /* justify-content: space-between; */
  /* border: 1px solid white; */
  padding-left: 20px;
  padding-right: 20px;
  @media (max-width: 1024px) {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
  @media (max-width: 888px) {
    flex-direction: column;
  }
`;
const ActivityDetail = styled.div`
  width: 400px;
  text-align: left;
  margin-right: 20px;
  @media (max-width: 888px) {
    width: 100%;
  }
`;

const TitleContainer = styled.div`
  position: relative;
`;
const Title = styled.div`
  font-size: 28px;
  border-bottom: 1px solid #979797;
  color: #fff;
`;
const CloseTitle = styled.div`
  position: absolute;
  left: 160px;
  bottom: 5px;
  font-size: 16px;
`;
const ItemField = styled.div`
  padding-left: 20px;
  @media (max-width: 888px) {
    width: 100%;
  }
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
  width: calc(100% - 400px);
  /* width: 600px; */
  margin-top: 20px;
  @media (max-width: 888px) {
    width: 100%;
  }
`;
const ActivityImage = styled.img`
  width: 100%;
  max-height: 400px;
  border-radius: 20px;
  object-fit: cover;
`;
const ButtonField = styled.div`
  margin-top: 20px;
  text-align: right;
  @media (max-width: 888px) {
    display: none;
  }
  @media (max-width: 576px) {
    display: flex;

    width: 100%;
    justify-content: space-between;
  }
`;
const RWDButtonField = styled.div`
  /* margin-top: -50px; */
  text-align: right;
  display: none;
  @media (max-width: 888px) {
    display: block;
  }
  @media (max-width: 576px) {
    display: none;
  }
`;

const Btn = styled.button`
  border: 1px solid #979797;
  border-radius: 10px;
  width: 150px;
  height: 50px;
  cursor: pointer;
  color: #fff;
  @media (max-width: 576px) {
    width: 50%;
  }
`;
const ShareButton = styled(Btn)`
  margin-right: 20px;
`;
const RWDShareButton = styled(Btn)`
  margin-right: 20px;
`;
const JoinButton = styled(Btn)``;
const ApplicantButton = styled(Btn)`
  cursor: not-allowed;
`;
const AttendantButton = styled(Btn)`
  cursor: not-allowed;
`;
const CommentTitle = styled.div`
  color: white;
  font-size: 24px;
  text-align: left;
  border-bottom: 1px solid #979797;
`;
const CommentField = styled.div`
  margin-top: 30px;
  color: white;
  text-align: left;
`;
const UpField = styled.div`
  display: flex;
  margin: 0px auto;
  justify-content: space-between;
  /* border: 1px solid white; */
  @media (max-width: 1024px) {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
  @media (max-width: 888px) {
    flex-direction: column;
  }
`;
const MemberInfoContainer = styled.div`
  width: 1024px;
  margin: 80px auto;
  text-align: left;
  color: #fff;
  padding-left: 20px;
  padding-right: 20px;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;
const MemberField = styled.div`
  padding: 10px 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;
const MemberHostField = styled.div`
  padding: 10px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  @media (max-width: 888px) {
    flex-direction: column;
  }
`;
const ProfileBlock = styled.div`
  text-align: center;
  margin: 20px 20px;
  position: relative;
`;

const ImageIntroBlock = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  @media (max-width: 888px) {
    width: 100%;
  }
`;
const HostProfileBlock = styled.div`
  margin: auto 20px;
  margin-right: 0px;
  text-align: center;
  margin: 20px 40px;
  position: relative;
  @media (max-width: 888px) {
  }
`;
const IntroBlock = styled.div`
  width: auto;
  padding: 20px;
  align-items: center;
  margin: auto;
  line-height: 2;
  word-wrap: break-word;
  @media (max-width: 888px) {
  }
`;
const VideoBlock = styled.div`
  @media (max-width: 888px) {
    width: 100%;
  }
`;
const VideoIframe = styled.iframe`
  width: 500px;
  height: 315px;
  @media (max-width: 1024px) {
    width: 450px;
    padding-left: 20px;
    padding-right: 20px;
  }
  @media (max-width: 888px) {
    width: unset;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
`;
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
  object-fit: cover;
  /* background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%; */
`;
export default Detail;
