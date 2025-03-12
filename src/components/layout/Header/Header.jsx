import React from "react";
import {Link} from "react-router-dom";
import styles from "./Header.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faSearch} from "@fortawesome/free-solid-svg-icons";


const Header = () => {
    return (
        <>
            <div className={styles.loginButton}>
                <FontAwesomeIcon icon={faUser}/>
                <div>로그인</div>
            </div>
            <div className={styles.title}>
                <span className={styles.insta}>Insta</span>
                <span className={styles.bid}>BID</span>
            </div>
            <nav className={styles.navBar}>
                <Link to="/auctions" className={styles.navItem}>
                    진행중인 경매
                </Link>
                <Link to="/categories" className={styles.navItem}>
                    종료된 경매
                </Link>
                <Link to="/contact" className={styles.navItem}>
                    이용가이드
                </Link>
            </nav>
            <div className={styles.searchArea}>
                <FontAwesomeIcon icon={faSearch} />
                <input  type="text" placeholder="상품을 검색하세요."/>
            </div>
        </>
    );
};

export default Header;