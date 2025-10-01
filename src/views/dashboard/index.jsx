import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FetchDashData, FetchGraph } from '../../../services/DashBoardApi';
import UserChart from './UserChart';
import BlogChart from './BlogCharts';

const DashDefault = () => {
  const [data, setData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [BlogData, setBlogData] = useState([]);
  const dashSalesData = [
    {
      title1: 'Users',
      title2: 'In-Active Users',
      total: data?.totalUsers,
      icon: 'icon-user text-c-green',
      value: data?.activeUsers,
      value1: data?.inactiveUsers
      // class: 'progress-c-theme'
    },
    {
      title1: 'Blogs',
      title2: 'In-Active Blogs',
      total: data?.totalBlogs,
      icon: 'icon-list text-c-green',
      value: data?.activeBlogs,
      value1: data?.inactiveBlogs
      // class: 'progress-c-theme2'
    },
    {
      title1: 'Package Type',
      // title2: 'In-Active Blogs',
      total: data?.packages,
      icon: 'icon-star text-c-green',
      value: data?.activeBlogs
      // value1: 60,
    },
    {
      title1: 'Revenue Generated',
      // title2: 'In-Active Blogs',
      total: '',
      icon: 'icon-list text-c-green',
      value: data?.revenue_generated
      // value1: 60
      // class: 'progress-c-theme2'
    }
  ];

  const DashData = async () => {
    const res = await FetchDashData();
    // console.log(res, 'dash');
    setData(res?.data?.data);
  };
  const GraphData = async () => {
    const res = await FetchGraph();
    setUserData(res?.data?.data?.userGraphData, 'User');
    setBlogData(res?.data?.data?.blogGraphData, 'Blog');
  };

  useEffect(() => {
    DashData();
    GraphData();
  }, []);

  return (
    <React.Fragment>
      <Row>
        {dashSalesData.map((item, index) => {
          return (
            <Col key={index} xl={6} xxl={3}>
              <Card>
                <Card.Body>
                  <h3 className=" head_main d-flex justify-content-between">
                    <i className={`feather ${item.icon}`} /> <span>{item.total}</span>
                  </h3>
                  {/* upper Bar */}
                  <div className="row m-0 d-flex align-items-center">
                    <div className="text_ll">
                      <h5 className="f-w-500 d-flex align-items-center f-16 m-b-0">{item.title1}</h5>
                      <p className="m-b-0 f-16 ">{item.value}</p>
                    </div>

                    <div className="progress m-t-10" style={{ height: '7px' }}>
                      <div
                        className={`progress-bar ${item.class}`}
                        role="progressbar"
                        style={{ width: `${item.value}%` }}
                        aria-valuenow={item.value}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  {/* Lower Bar */}
                  <div className="row m-0 d-flex align-items-center mt-3">
                    <div className="text_ll">
                      <h5 className="f-w-500 d-flex align-items-center f-16 m-b-0">{item.title2}</h5>
                      <p className="m-b-0 f-16">{item.value1}</p>
                    </div>

                    <div className="progress m-t-10" style={{ height: '7px' }}>
                      <div
                        className={`progress-bar ${item.class}`}
                        role="progressbar"
                        style={{ width: `${item.value1}%` }}
                        aria-valuenow={item.value1}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <UserChart UserData={UserData} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <BlogChart BlogData={BlogData} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashDefault;
