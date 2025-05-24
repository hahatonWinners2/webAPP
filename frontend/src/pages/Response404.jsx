import {Result, Button} from 'antd'

const Response404 = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={() => {window.history.back()}}>Back Home</Button>}
        />
    )
}

export default Response404