import * as React from 'react';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

export default class Doc extends React.Component<Props, undefined> {
	componentDidMount() {
		document.title = '文档';
	}
    render() {
        return (
        	<div>
        		<div className="cell-group border-top-none usercenter_body--border-top usercenter_body--border-bottom">
                    <div className="cell height-auto no-padding">
                        我的预约单
                    </div>
                    <div className="cell height-auto no-padding">
                        我的预约单
                    </div>
                </div>
        	</div>
        );
    }
}