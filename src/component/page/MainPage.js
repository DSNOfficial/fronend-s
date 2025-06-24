import { Card, Spin } from "antd"
const MainPage = ({children,loading=false}) => {

    return (
        <div>
            <Spin spinning={loading} >
                <Card>
                    {children}
                </Card>
            </Spin>
        </div>
    )
}
export default MainPage