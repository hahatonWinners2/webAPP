import './Header.css'

const Header = (props) => {
    return (
        <header>
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
            }}>
                { props.useLogo!=="false" ? <img src="/src/assets/tns.png" className="header-btn" /> : '' }
                {props.children}
            </div>
        </header>
    )
}

export default Header