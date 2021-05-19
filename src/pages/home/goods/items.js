import React from "react";
import config from '../../../assets/js/conf/config';
import {request} from "../../../assets/js/libs/request";
import IScroll from '../../../assets/js/libs/iscroll.js';
import {lazyImg,localParam} from '../../../assets/js/utils/util.js';
import Css from '../../../assets/css/home/goods/items.css';

export default class GoodsItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aGoods: [],
        }
        this.myScroll = null;
    }
    componentDidMount() {
        this.getData(this.props);
    }
    componentWillReceiveProps(newProps) {
        this.getData(newProps)
    }
    getData(props){
        let cid=props.location.search?localParam(props.location.search).search.cid:'';
        request(config.baseUrl+"/api/home/category/show?cid="+cid+"&token="+config.token).then(res=>{
            if (res.code ===200){
                this.setState({aGoods:res.data},()=>{
                    this.eventScroll();
                    lazyImg();
                    this.myScroll.on("scrollEnd",()=>{
                        lazyImg();
                    });
                })
            }else{
                this.setState({aGoods:[]})
            }
        })
    }
    eventScroll(){
        document.getElementById("goods-content-main").addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        this.myScroll= new IScroll('#goods-content-main', {
            scrollX : false,
            scrollY : true,
            preventDefault : false
        });
    }
    render(){
        return(
            <div id="goods-content-main" className={Css['goods-content-main']}>
                <div>
                    {
                        this.state.aGoods.length>0?
                            this.state.aGoods.map((item, index)=>{
                                return (
                                    <div className={Css['goods-wrap']} key={index}>
                                        <div className={Css['classify-name']}>{item.title}</div>
                                        <div className={Css['goods-items-wrap']}>
                                            {
                                                item.goods!=null?
                                                    item.goods.map((item2, index2)=>{
                                                        return (
                                                            <ul key={index2}>
                                                                <li><img data-echo={item2.image} src={require("../../../assets/images/common/lazyImg.jpg")} alt={item2.title}/></li>
                                                                <li>{item2.title}</li>
                                                            </ul>
                                                        )
                                                    })
                                                    :""
                                            }
                                        </div>
                                    </div>
                                )
                            })
                            :<div className="null-item">没有相关商品！</div>
                    }
                </div>
            </div>
        );
    }
}