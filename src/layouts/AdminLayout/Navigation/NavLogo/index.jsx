import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../../assets/images/JungloreLogo.svg';
import { ConfigContext } from '../../../../contexts/ConfigContext';
import * as actionType from '../../../../store/actions';

const NavLogo = () => {
  const configContext = useContext(ConfigContext);
  const { collapseMenu } = configContext.state;
  const { dispatch } = configContext;

  let toggleClass = ['mobile-menu'];
  if (collapseMenu) {
    toggleClass = [...toggleClass, 'on'];
  }

  return (
    <React.Fragment>
      <div className="navbar-brand header-logo">
        <Link to="#" className="b-brand">
          <div className="">
            <img src={logo} alt="" className="w-5" />
          </div>
        </Link>
        {/* <Link to="#" className={toggleClass.join(' ')} id="mobile-collapse" onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}>
          <span />
        </Link> */}
      </div>
    </React.Fragment>
  );
};

export default NavLogo;
