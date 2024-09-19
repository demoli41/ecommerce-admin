import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {subHours} from "date-fns";


export default function HomeStats() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/orders').then(res=>{
            setOrders(res.data);
            setIsLoading(false);
        });
    },[])

    function ordersTotal(orders){
        let sum=0;
        orders.forEach(order=>{
            const{line_items}=order;
            line_items.forEach(li=>{
                const lineSum=li.quantity *li.price_data.unit_amount/100;
                sum+=lineSum;
            })
        });
        return new Intl.NumberFormat('uk-UA').format(sum);
    }

    if(isLoading) {
        return (
            <div className='my-4'>
                <Spinner fullWidth={true}/>
            </div>
        );
    }

    const ordersToday=orders.filter(o=>new Date(o.createdAt)> subHours(new Date,24));
    const ordersThisWeek=orders.filter(o=>new Date(o.createdAt)> subHours(new Date,24*7));
    const ordersThisMonth=orders.filter(o=>new Date(o.createdAt)> subHours(new Date,24*30));


    return(
        <div className="">
            <h2>Orders</h2>
            <div className='tiles-grid'>
                <div className='tile'>
                    <h3 className='tile-header'>Today</h3>
                    <div className='tile-number'>{ordersToday.length}</div>
                    <div className='tile-desc'>{ordersToday.length} orders today</div>
                </div>
                <div className='tile'>
                    <h3 className='tile-header'>This week</h3>
                    <div className='tile-number'>{ordersThisWeek.length}</div>
                    <div className='tile-desc'>{ordersThisWeek.length} orders this week</div>
                </div>
                <div className='tile'>
                    <h3 className='tile-header'>This month</h3>
                    <div className='tile-number'>{ordersThisMonth.length}</div>
                    <div className='tile-desc'>{ordersThisMonth.length} orders this month</div>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className='grid grid-cols-3 gap-4'>
                <div className='tile'>
                    <h3 className='tile-header'>Today</h3>
                    <div className='tile-number'>${ordersTotal(ordersToday)}</div>
                    <div className='tile-desc'></div>
                </div>
                <div className='tile'>
                    <h3 className='tile-header'>This week</h3>
                    <div className='tile-number'>${ordersTotal(ordersThisWeek)}</div>
                    <div className='tile-desc'></div>
                </div>
                <div className='tile'>
                    <h3 className='tile-header'>This month</h3>
                    <div className='tile-number'>${ordersTotal(ordersThisMonth)}</div>
                    <div className='tile-desc'></div>
                </div>
            </div>
        </div>
    );
}