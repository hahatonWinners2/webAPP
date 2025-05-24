import './Header.css'

const Header = (props) => {
    return (
        <header>
            { props.useLogo!=="false" ? <img src="/src/assets/tns.png" className="header-btn" /> : '' }
            {props.children}
        </header>
    )
}

export default Header