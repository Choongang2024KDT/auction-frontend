import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Header.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { EventSourcePolyfill } from "event-source-polyfill";
import { fetchNotifications, markAsRead, setNotifications } from "../../../features/notifications/notificationsSlice";
import { API_BASE_URL } from "../../../config/host-config.js";
import auctionImg from "../../img/auction.png"

const Header = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, logout, userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [eventSource, setEventSource] = useState(null);

    // 스크롤 이벤트 핸들러
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // SSE 연결 설정 함수 useCallback이 없으면  컴포넌트가 리렌더링될 때마다 setupSse가 새로 생성됨.
    const setupSse = useCallback(() => {
        if (!isAuthenticated || !userInfo?.memberId) return;

        // 기존 연결 정리
        if (eventSource && eventSource.readyState !== EventSourcePolyfill.CLOSED) {
            console.log("Closing existing SSE connection...");
            eventSource.close();
        }

        const token = userInfo?.accessToken || localStorage.getItem("accessToken");
        if (!token) {
            console.error("No access token available");
            return;
        }

        const newEventSource = new EventSourcePolyfill(`${API_BASE_URL}/api/notifications/stream/new`, {
            headers: { "Authorization": `Bearer ${token}` },
            withCredentials: true,
            heartbeatTimeout: 10 * 60 * 1000, // heartbeat 따로 안 보내지만 10분 정도마다 연결 정리
        });

        // 이벤트 리스너 설정
        newEventSource.onopen = () => {
            console.log("SSE connection established at:", new Date().toLocaleTimeString());
            dispatch(fetchNotifications());
        };

        newEventSource.addEventListener("notification", (event) => {
            const newNotification = JSON.parse(event.data);
            dispatch(setNotifications([newNotification, ...notifications]));
        });

        newEventSource.addEventListener("connect", (event) => {
            console.log("Connect event received:", event.data);
        });

        newEventSource.addEventListener("heartbeat", (event) => {
            console.log("Heartbeat received:", event.data);
        });

        newEventSource.onerror = () => {
            console.log("SSE connection closed or errored at:", new Date().toLocaleTimeString());
            // 연결이 끊어졌을 때 기존 연결 정리 후 재연결 시도
            if (newEventSource.readyState !== EventSourcePolyfill.CLOSED) {
                newEventSource.close();
            }
            setEventSource(null);
            setupSse(); // 재연결 시도
        };

        setEventSource(newEventSource);
    }, [userInfo, dispatch, isAuthenticated]);

    // SSE 연결 관리
    useEffect(() => {
        if (isAuthenticated && userInfo?.memberId) {
            setupSse();
        }
        return () => {
            if (eventSource && eventSource.readyState !== EventSourcePolyfill.CLOSED) {
                console.log("Closing SSE due to unauthenticated state");
                eventSource.close();
            }
            setEventSource(null);
        };
    }, [isAuthenticated, userInfo, setupSse]);

    const handleLogout = async () => {
        if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
            console.log("Closing SSE on logout");
            eventSource.close();
            setEventSource(null);
        }

        if (logout) {
            await logout();
            navigate("/");
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("username");
            localStorage.removeItem("name");
            localStorage.removeItem("memberId");
            navigate("/");
            window.location.reload();
        }
    };

    const toggleNotifications = () => {
        if (isAuthenticated) {
            dispatch(fetchNotifications());
        }
        setShowNotifications((prev) => !prev);
    };

    const handleMarkAsRead = (notificationId) => {
        console.log("Marking notification as read:", notificationId);
        dispatch(markAsRead(notificationId));
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                <div className={styles.flexContainer}>
                    <Link to="/" className={styles.logo}>
                        <img src={auctionImg} alt="로고이미지" />
                    </Link>
                    <nav className={styles.desktopNav}>
                        <Link to="/ongoing-auctions" className={styles.navItem}>경매 리스트</Link>
                        <Link to="/ended-auctions" className={styles.navItem}>종료된 경매</Link>
                        <Link to="/guide" className={styles.navItem}>이용가이드</Link>
                        <Link to="/reserved-auctions" className={styles.navItem}>예약된 경매</Link>
                    </nav>
                    <div className={styles.searchContainer}>
                        <input type="search" placeholder="검색" className={styles.searchInput} />
                    </div>
                    <div className={styles.buttonContainer}>
                        {isAuthenticated ? (
                            <>
                <span className={styles.welcomeText}>
                  {userInfo?.name || "사용자"}님 환영합니다
                </span>
                                <div className={styles["icon-container"]} onClick={toggleNotifications}>
                                    <FontAwesomeIcon icon={faBell} className={styles.icon} />
                                    {unreadCount > 0 && (
                                        <span className={styles["unread-badge"]}>{unreadCount}</span>
                                    )}
                                </div>
                                {showNotifications && (
                                    <div className={styles["notification-list"]}>
                                        {notifications.length === 0 ? (
                                            <p className={styles["no-notifications"]}>새로운 알림이 없습니다.</p>
                                        ) : (
                                            notifications.slice(0, 5).map((notification) => (
                                                <div
                                                    key={notification.notificationId}
                                                    className={`${styles["notification-item"]} ${
                                                        notification.isRead ? styles.read : styles.unread
                                                    }`}
                                                    onClick={() => {
                                                        if (!notification.isRead) handleMarkAsRead(notification.notificationId);
                                                        if (notification.link) navigate(notification.link);
                                                        setShowNotifications(false);
                                                    }}
                                                >
                                                    <p>{notification.message}</p>
                                                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                                                    <br />
                                                    {notification.safeNumber && (
                                                        <small>안심번호: {notification.safeNumber}</small>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                        <div className={styles["view-all"]}>
                                            <Link to="/mypage" onClick={() => setShowNotifications(false)}>
                                                전체 알림 보기
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                <Link to="/mypage">
                                    <button className={styles.button}>마이페이지</button>
                                </Link>
                                <button onClick={handleLogout} className={styles.button}>로그아웃</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><button className={styles.button}>로그인</button></Link>
                                <Link to="/signup"><button className={styles.button}>회원가입</button></Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;