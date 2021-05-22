import React from "react";
import config from '../../assets/js/conf/config';
import {request} from "../../assets/js/libs/request";
import Css from './search.css';
import {Modal} from 'antd-mobile';
import {connect} from 'react-redux';
import action from '../../actions/index';

class SearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bHistory: true,
            aHotKeywords: [],
            keywords: ''
        };
        this.aKeywords = props.state.hk.keywords;
    }
    componentDidMount() {
        if (this.aKeywords.length > 0) {
            this.setState({bHistory: true});
        } else {
            this.setState({bHistory: false});
        }
        this.getHotKeywords();
    }
    getHotKeywords() {
        request(config.baseUrl + '/api/home/public/hotwords?token=' + config.token).then(res => {
            if (res.code === 200) {
                this.setState({aHotKeywords: res.data});
            } else {
                this.setState({aHotKeywords: []});
            }
        })
    }
    clearHistory() {
        Modal.alert('', '确定要删除吗？', [
            { text: '取消', onPress: () => {}, style: 'default' },
            { text: '确认', onPress: () => {
                this.setState({bHistory: false});
                localStorage.removeItem('hk');
                this.aKeywords = [];
                this.props.dispatch({type: 'addHK', keywords: []});
            }},
        ]);
    }
    addHistoryKeywords() {
        for(let i = 0; i < this.aKeywords.length; i++) {
            if(this.aKeywords[i] === this.state.keywords) {
                this.aKeywords.splice(i--, 1)
            }
        }
        this.aKeywords.unshift(this.state.keywords);
        localStorage['hk'] = JSON.stringify(this.aKeywords);
        this.props.dispatch(action.hk.addHistoryKeywords({keywords: this.aKeywords}));
        this.setState({bHistory: true});
        console.log(this.props.state.hk.keywords);
    }
    render(){
        return(
            <div className={Css['page']} style={this.props.pageStyle}>
                <div className={Css['search-header']}>
                    <div className={Css['close']} onClick={this.props.childStyle.bind(this, {display: 'none'})}></div>
                    <div className={Css['search-wrap']}>
                    <div className={Css['search-input-wrap']}>
                        <input type="text" className={Css['search']} placeholder="请输入宝贝名称" onChange={(e) => this.setState({keywords: e.target.value})} />
                    </div>
                        <button type="button" className={Css['search-btn']} onClick={this.addHistoryKeywords.bind(this)}></button>
                    </div>
                </div>
                <div className={this.state.bHistory ? Css['search-main'] : Css['search-main'] + ' hide'}>
                    <div className={Css['search-title-wrap']}>
                        <div className={Css['search-title']}>最近搜索</div>
                        <div className={Css['bin']} onClick={this.clearHistory.bind(this)}></div>
                    </div>
                    <div className={Css['search-keywords-wrap']}>
                        {
                            this.props.state.hk.keywords !== null ?
                            this.props.state.hk.keywords.map((item, index) => {
                                return <div className={Css['keywords']} key={index}>{item}</div>
                            }) : ''
                        }
                    </div>
                </div>
                <div className={Css['search-main']}>
                    <div className={Css['search-title-wrap']}>
                        <div className={Css['search-title']}>热门搜索</div>
                        <div className={Css['search-bin']}></div>
                    </div>
                    <div className={Css['search-keywords-wrap']}>
                        {
                            this.state.aHotKeywords !== null ? this.state.aHotKeywords.map((item, index) => {
                                return (
                                    <div className={Css['keywords']}>{item.title}</div>
                                )
                            }) : ''
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        state: state,
    }
})(SearchComponent)