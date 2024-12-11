import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiRefreshCw } from 'react-icons/fi';


const TableOverview = ({darkMode}) => {
  const initialData = [
    { id: 1, partname: "FAN_CASE_L", partcode: "VU25Y393G01", countershot: "0", target: "50000", mainshot:0, status: "Stopping" },
    { id: 2, partname: "FAN_CASE_U", partcode: "VU25Y392G01", countershot: "0", target: "50000", mainshot:0, status: "Stopping" },
    { id: 3, partname: "PB_SUPPORT_460M", partcode: "DY25A709H01", countershot: "0", mainshot:0, target: "50000", status: "Stopping" },
    { id: 4, partname: "PB-SUPPORT 611", partcode: "DY25Y055H02", countershot: "0", mainshot:0, target: "50000", status: "Stopping" },
   
  ];

  const [data, setData] = useState(initialData);// เก็บข้อมูลที่จะใช้แสดงในตาราง
  const [isLoading, setIsLoading] = useState(true);//ตรวจสอบสถานะการโหลดข้อมูล
  const [error, setError] = useState(null);// จัดการข้อผิดพลาดที่อาจเกิดขึ้นขณะดึงข้อมูล
  const [lastRefresh, setLastRefresh] = useState(new Date());//เก็บเวลาอัปเดตข้อมูลล่าสุด
  const [isRefreshing, setIsRefreshing] = useState(false);//ตรวจสอบสถานะระหว่างการรีเฟชข้อมูล
  //ครั้งเเรกที่เปิดหน้าเว็บ
  useEffect(() => {
    //เป็นฟังก์ชันหลักที่ดึงข้อมูลจาก API
    fetchData();
    const refreshInterval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(refreshInterval);
  }, []);
 
  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("http://localhost:3005/api/user_mc");
      const result = await response.json();

      const formattedData = initialData.map(initialRow => {
        const apiMatch = result.find(apiRow => 
          (apiRow.partname || apiRow.PARTNAME) === initialRow.partname
        );
        
        if (apiMatch) {
          return {
            id: initialRow.id,
            partname: apiMatch.partname || apiMatch.PARTNAME,
            partcode: apiMatch.partcode || apiMatch.PARTCODE || "",
            countershot: apiMatch.countershot || apiMatch.counterShot || "0",
            target: apiMatch.target || "50000",
            mainshot:apiMatch.mainshot ,
            status: apiMatch.status || "stopping"
          };
        }
        return initialRow;
      });

      setData(formattedData);
      setError(null);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleReset = async (partname) => {
    try {
      const response = await fetch(`http://localhost:3005/api/user_mc/reset/${partname}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countershot: "0"//เเปลงเป็นjson
        })
      });

      if (!response.ok) throw new Error('Reset failed');
      await fetchData();
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleManualRefresh = () => {
    fetchData();
  };

  const formatLastRefreshTime = (date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getProgressBarColor = (shot) => {
    const shots = parseInt(shot);
    if (shots <= 45000) return '#4CAF50';
    if (shots <= 49999) return '#FFA726';
    return '#FF5252';
  };

  const getProgressBarWidth = (shot, target) => {
    const percentage = (parseInt(shot) / parseInt(target)) * 100;
    return `${Math.min(percentage, 100)}%`;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }
  
  return (
   
    <div className="dashboard-container">
      <div className={`header-actions  ${darkMode ? 'dark-mode' : ''} `}>
        <div className="refresh-info">
          <span className="last-refresh">
            Last updated: {formatLastRefreshTime(lastRefresh)}
          </span>
          <button 
            className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <FiRefreshCw className="refresh-icon" />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}

      </div>

      
      <div className={`table-container ${darkMode ? 'dark-mode' : ''}`}>
        <table className="production-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>Part Name</th>
              <th>Part Code</th>
              <th>Production Progress</th>
              <th>Main Shot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  <Link to={`/table/${row.partname}`} className="part-link" state={{data}}>
                    {row.partname}
                  </Link>
                  
                </td>
                <td>{row.partcode}</td>
                <td>
                  <div className="progress-container">
                    <div className="progress-bar-wrapper">
                      <div
                        className="progress-bar"
                        style={{
                          width: getProgressBarWidth(row.countershot, row.target),
                          backgroundColor: getProgressBarColor(row.countershot)
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {row.countershot} / {row.target}
                    </span>
                  </div>
                </td>
                <td>
                  {row.mainshot}
                </td>
                <td>
                  <span className={`status-badge ${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  {parseInt(row.countershot) >= 50000 && (
                    <button
                      className="caution-button"
                      onClick={() => handleReset(row.partname)}
                    >
                      CAUTION FOR PM
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      <style>
        {`
          .dashboard-container {
            margin-top: 1rem;
          }

          .header-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding: 0.75rem 1.5rem;
            background:  #fff; 
            border-radius: 8px;
          }
          .header-actions.dark-mode{
          background:#1a1a1a;
          }
          .refresh-info {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .last-refresh {
            color: #a0aec0;
            font-size: 1.1rem;
          }

          .refresh-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: #3182ce;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 1.1rem;
          }

          .refresh-button:hover:not(:disabled) {
            background: #2c5282;
          }

          .refresh-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .refresh-icon {
            font-size: 1.1rem;
          }

          .refreshing .refresh-icon {
            animation: spin 1s linear infinite;
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            gap: 1rem;
            color: #a0aec0;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #1a1a1a;
            border-top: 3px solid #3182ce;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .error-message {
            background: rgba(255, 82, 82, 0.1);
            color: #FF5252;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            text-align: center;
          }

          .table-container {
            background:#EAE4DD;
            border-radius: 8px;
            padding: 1.5rem;
             overflow-x: auto;
          
          }
          .table-container.dark-mode{
          background:#2d2d2d}
          .production-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            color: #FF8C00;
            font-size: 1.25rem;
          }

          .production-table th {
            background: #1a1a1a;
            padding: 1.25rem;
            text-align: left;
            font-weight: 600;
            font-size: 1.25rem;
            color: #FF8C00;
          }

          .production-table td {
            padding: 1.25rem;
            border-bottom: 1px solid #3d3d3d;
            font-size: 1.25rem;
            vertical-align: middle;
          }

          .part-link {
            color: #00B4DB;
            text-decoration: none;
            transition: color 0.2s;
            font-size: 1.25rem;
            font-weight: 500;
          }

          .part-link:hover {
            color: #0083B0;
          }

          .progress-container {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .progress-bar-wrapper {
            flex-grow: 1;
            height: 12px;
            background: #1a1a1a;
            border-radius: 6px;
            overflow: hidden;
          }

          .progress-bar {
            height: 100%;
            border-radius: 6px;
            transition: width 0.3s ease, background-color 0.3s ease;
          }

          .progress-text {
            min-width: 120px;
            text-align: right;
            font-size: 1.25rem;
            color: #a0aec0;
          }

          .status-badge {
            padding: 0.5rem 1rem;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 500;
            display: inline-block;
          }

          .status-badge.running {
            background: rgba(76, 175, 80, 0.2);
            color: #4CAF50;
          }

          .status-badge.stopping {
            background: rgba(255, 167, 38, 0.2);
            color: #FFA726;
          }

          .caution-button {
            background: #FF5252;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
            animation: pulse 2s infinite;
          }

          .caution-button:hover {
            background: #FF1744;
            transform: translateY(-1px);
          }

          .caution-button:active {
            transform: translateY(0);
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          @keyframes spin {
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 1024px) {
            .header-actions {
              flex-direction: column;
              gap: 1rem;
            }

            .refresh-info {
              width: 100%;
              justify-content:center;
            }

            .progress-bar-wrapper{
            display:none;}
            
            .production-table {
              min-width: 600px;
              font-size: 1rem;
            }

            .production-table th,
            .production-table td {
              padding: 1rem 0.25rem;
              font-size: 1rem;
            }

            .status-badge {
              padding: 0.4rem 0.8rem;
              font-size: 0.9rem;
            }

            .progress-text {
              font-size: 1rem;
            }

            .caution-button {
              padding: 0.5rem 1rem;
              font-size: 0.9rem;
            }
          }
        `}
      </style>
    </div>
   );
};


export default TableOverview;