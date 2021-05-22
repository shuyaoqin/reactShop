import React from "react";
import {Route, Switch} from 'react-router-dom';
import config from '../../../assets/js/conf/config';
import IScroll from '../../../assets/js/libs/iscroll.js';
import asyncComponents from '../../../components/async/AsyncComponent';
import Css from '../../../assets/css/home/goods/classify.css';
import {request} from '../../../assets/js/libs/request.js';
import {localParam} from "../../../assets/js/utils/util";
import SearchComponent from '../../../components/search/search';

const GoodsItems = asyncComponents(() => import('./items'));
export default class GoodsClassify extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            aClassify: [],
            pageStyle: {display: 'none'},
        }
        this.myScroll = null;
        this.aTempClassify = [];
        this.cid = props.location.search ? localParam(props.location.search).search.cid : '492';
    }
    componentDidMount() {
        this.getClassifyData();
    }
    replacePage(pUrl){
        this.props.history.replace(config.path+pUrl);
    }
    goBack() {
        this.props.history.goBack();
    }
    eventScroll() {
        document.getElementById("scroll-classify").addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        this.myScroll= new IScroll('#scroll-classify', {
            scrollX : false,
            scrollY : true,
            preventDefault : false
        });
    }
    getClassifyData(){
        request(config.baseUrl+"/api/home/category/menu?token="+config.token).then(res =>{
            if (res.code === 200){
                this.aTempClassify = res.data;
                for (let i = 0; i < this.aTempClassify.length; i++){
                    this.aTempClassify[i].bActive=false;
                }
                this.setState({aClassify: this.aTempClassify}, () => {
                    this.eventScroll();
                    this.defaultClassifyStyle();
                })
            }
        } );
    }
    changeStyle(pUrl, pIndex) {
        for (let i = 0; i< this.aTempClassify.length; i++) {
            this.aTempClassify[i].bActive = false;
        }
        this.aTempClassify[pIndex].bActive = true;
        this.handleScroll(pIndex);
        this.replacePage(pUrl)
    }
    handleScroll(pIndex){
        let oScrollClassify = document.getElementById("scroll-classify");
        let iTopHeight = Math.round(parseInt(this.refs['item-'+pIndex].offsetHeight)*pIndex);
        let iHalfHeight = Math.round(oScrollClassify.offsetHeight/3);
        let iBottomHeight = oScrollClassify.scrollHeight-iTopHeight;
        if (iTopHeight > iHalfHeight && iBottomHeight > oScrollClassify.offsetHeight){
            this.myScroll.scrollTo(0,-iTopHeight,300,IScroll.utils.ease.elastic);
        }
    }
    defaultClassifyStyle(){
        if (this.aTempClassify.length > 0){
            for (let i=0;i<this.aTempClassify.length;i++){
                if (this.aTempClassify[i].cid === this.cid){
                    this.aTempClassify[i].bActive = true;
                    break;
                }
            }
            this.setState({aClassify: this.aTempClassify});
        }
    }
    getStyle(val) {
        this.setState({pageStyle: val})
    }
    changePageStyle() {
        this.setState({pageStyle: {display: 'block'}})
    }
    render() {
        return (
            <div>
                <div className={Css['search-header']}>
                    <div className={Css['back']} onClick={this.goBack.bind(this)}></div>
                    <div className={Css['search']} onClick={this.changePageStyle.bind(this)}>请输入宝贝名称</div>

                </div>
                <div className={Css['goods-main']}>
                    <div id="scroll-classify" className={Css['classify-wrap']}>
                        <div>
                            {
                                this.state.aClassify !== null ? this.state.aClassify.map((item, index) => {
                                    return (
                                            <div ref={"item-"+index} className={item.bActive?Css['classify-item']+" "+Css['active']:Css['classify-item']} key={index} onClick={this.changeStyle.bind(this, 'goods/classify/items?cid='+item.cid+'',index)}>{item.title}</div>
                                        )
                                }) : ''
                            }
                        </div>
                    </div>
                    <div className={Css['goods-content']}>
                        <Switch>
                            <Route path={config.path+'goods/classify/items'} component={GoodsItems}></Route>
                        </Switch>
                    </div>
                </div>
                <SearchComponent pageStyle={this.state.pageStyle} childStyle={this.getStyle.bind(this)}></SearchComponent>
            </div>
        )
    }
}