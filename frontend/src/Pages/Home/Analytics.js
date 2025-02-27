import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { ArrowDropUp, ArrowDropDown, CurrencyRupee } from '@mui/icons-material';

// Custom circular progress component with light theme
const CircularProgressBar = ({ percentage, color }) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="position-relative" style={{ width: radius * 2, height: radius * 2 }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <div 
        className="position-absolute d-flex align-items-center justify-content-center"
        style={{ top: 0, left: 0, right: 0, bottom: 0, fontWeight: "bold", fontSize: "16px" }}
      >
        {percentage}%
      </div>
    </div>
  );
};

// Custom line progress component with light theme
const LineProgressBar = ({ label, percentage, lineColor }) => {
  return (
    <div className="my-3">
      <div className="d-flex justify-content-between">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress" style={{ height: "10px", backgroundColor: "#f0f0f0" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${percentage}%`, backgroundColor: lineColor }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

// Simple SVG donut chart component
const DonutChart = ({ data, colors, width = 200, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = Math.min(width, height) / 2 * 0.8;
  const centerX = width / 2;
  const centerY = height / 2;
  const donutWidth = radius * 0.35;

  let startAngle = 0;
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${centerX},${centerY})`}>
        {data.map((item, i) => {
          const percentage = item.value / total;
          const endAngle = startAngle + percentage * 2 * Math.PI;
          
          // Calculate the path for the arc
          const x1 = radius * Math.sin(startAngle);
          const y1 = -radius * Math.cos(startAngle);
          const x2 = radius * Math.sin(endAngle);
          const y2 = -radius * Math.cos(endAngle);
          
          const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
          
          // Outer arc
          const outerPath = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
          ].join(' ');
          
          // Inner arc
          const innerRadius = radius - donutWidth;
          const x3 = innerRadius * Math.sin(endAngle);
          const y3 = -innerRadius * Math.cos(endAngle);
          const x4 = innerRadius * Math.sin(startAngle);
          const y4 = -innerRadius * Math.cos(startAngle);
          
          const innerPath = [
            `M ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            `L ${x1} ${y1}`
          ].join(' ');
          
          const path = [outerPath, innerPath].join(' ');
          
          // Calculate text position
          const textAngle = startAngle + (endAngle - startAngle) / 2;
          const textRadius = radius - donutWidth / 2;
          const textX = textRadius * Math.sin(textAngle);
          const textY = -textRadius * Math.cos(textAngle);
          
          // Only show text for segments large enough
          const showText = percentage > 0.05;
          
          // Update startAngle for next segment
          startAngle = endAngle;
          
          return (
            <g key={i}>
              <path d={path} fill={colors[i % colors.length]} />
              {showText && (
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="smaller"
                  fontWeight="bold"
                >
                  {Math.round(percentage * 100)}%
                </text>
              )}
            </g>
          );
        })}
        {/* Add a center circle for better aesthetics */}
        <circle r={radius - donutWidth} fill="white" />
      </g>
    </svg>
  );
};

// Simple bar chart component
const BarChart = ({ data, width = 500, height = 300 }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = width / data.length * 0.7;
  const spacing = width / data.length * 0.3;
  const chartHeight = height * 0.8;
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Y-axis */}
      <line x1={40} y1={20} x2={40} y2={chartHeight + 20} stroke="#ccc" strokeWidth="1" />
      
      {/* X-axis */}
      <line x1={40} y1={chartHeight + 20} x2={width - 20} y2={chartHeight + 20} stroke="#ccc" strokeWidth="1" />
      
      {/* Bars */}
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = 40 + (barWidth + spacing) * i + spacing / 2;
        const y = chartHeight + 20 - barHeight;
        
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={item.color}
              rx="2"
              ry="2"
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 40}
              textAnchor="middle"
              fontSize="12"
              fill="#555"
            >
              {item.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="12"
              fill="#555"
            >
              {item.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Analytics = ({ transactions }) => {
  // Calculate transaction statistics
  const totalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  const totalIncomePercent = totalTransactions > 0 
    ? (totalIncomeTransactions.length / totalTransactions) * 100 
    : 0;
  const totalExpensePercent = totalTransactions > 0 
    ? (totalExpenseTransactions.length / totalTransactions) * 100 
    : 0;

  // Calculate financial amounts
  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const turnOverIncomePercent = totalTurnOver > 0 
    ? (totalTurnOverIncome / totalTurnOver) * 100 
    : 0;
  const turnOverExpensePercent = totalTurnOver > 0 
    ? (totalTurnOverExpense / totalTurnOver) * 100 
    : 0;

  // Categories and colors
  const categories = [
    "Groceries", "Rent", "Salary", "Tip", "Food", 
    "Medical", "Utilities", "Entertainment", "Transportation", "Other"
  ];

  const colors = {
    "Groceries": '#FF6384',
    "Rent": '#36A2EB',
    "Salary": '#FFCE56',
    "Tip": '#4BC0C0',
    "Food": '#9966FF',
    "Medical": '#FF9F40',
    "Utilities": '#8AC926',
    "Entertainment": '#6A4C93',
    "Transportation": '#1982C4',
    "Other": '#F45B69',
  };

  // Prepare data for charts
  const transactionTypeData = [
    { name: 'Income', value: totalIncomeTransactions.length },
    { name: 'Expense', value: totalExpenseTransactions.length }
  ];

  const turnoverData = [
    { name: 'Income', value: totalTurnOverIncome },
    { name: 'Expense', value: totalTurnOverExpense }
  ];

  // Prepare data for monthly chart
  const getMonthlyData = () => {
    const monthMap = {};
    
    transactions.forEach(transaction => {
      try {
        const date = new Date(transaction.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
        
        if (!monthMap[monthYear]) {
          monthMap[monthYear] = { income: 0, expense: 0 };
        }
        
        if (transaction.transactionType === "credit") {
          monthMap[monthYear].income += transaction.amount;
        } else {
          monthMap[monthYear].expense += transaction.amount;
        }
      } catch (error) {
        console.error("Error processing date:", error);
      }
    });
    
    // Convert to array and sort
    return Object.entries(monthMap)
      .map(([month, data]) => ({
        label: month,
        incomeValue: data.income,
        expenseValue: data.expense,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.label.split('/');
        const [bMonth, bYear] = b.label.split('/');
        return (aYear - bYear) || (aMonth - bMonth);
      });
  };
  
  const monthlyData = getMonthlyData();
  
  // Format for bar chart
  const monthlyChartData = [];
  monthlyData.forEach(item => {
    monthlyChartData.push({ 
      label: `${item.label} Inc`, 
      value: item.incomeValue, 
      color: '#28a745' 
    });
    monthlyChartData.push({ 
      label: `${item.label} Exp`, 
      value: item.expenseValue, 
      color: '#dc3545' 
    });
  });

  // Process category data
  const getCategoryData = (type) => {
    return categories.map(category => {
      const amount = transactions
        .filter(transaction => 
          transaction.transactionType === type && 
          transaction.category === category
        )
        .reduce((acc, transaction) => acc + transaction.amount, 0);
      
      return {
        name: category,
        value: amount
      };
    }).filter(item => item.value > 0);
  };

  const incomeByCategory = getCategoryData("credit");
  const expenseByCategory = getCategoryData("expense");

  // Chart colors for donut charts
  const chartColors = Object.values(colors);

  return (
    <Container className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <h2 className="mb-4 text-center">Financial Analytics Dashboard</h2>
      
      {/* Transaction Summary Cards */}
      <Row className="mb-5">
        <Col lg={6} md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Transaction Summary</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <h6>Total Transactions: {totalTransactions}</h6>
              </div>
              
              <Row>
                <Col md={6} className="mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h6 className="text-success">
                      <ArrowDropUp /> Income: {totalIncomeTransactions.length}
                    </h6>
                    <CircularProgressBar percentage={totalIncomePercent.toFixed(0)} color="#28a745" />
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h6 className="text-danger">
                      <ArrowDropDown /> Expense: {totalExpenseTransactions.length}
                    </h6>
                    <CircularProgressBar percentage={totalExpensePercent.toFixed(0)} color="#dc3545" />
                  </div>
                </Col>
              </Row>
              
              <div className="mt-auto d-flex justify-content-center">
                {totalTransactions > 0 && (
                  <DonutChart 
                    data={transactionTypeData}
                    colors={['#28a745', '#dc3545']}
                  />
                )}
              </div>
              
              <div className="text-center mt-2">
                <div className="d-flex justify-content-center">
                  <div className="d-flex align-items-center me-3">
                    <div style={{ width: 12, height: 12, backgroundColor: '#28a745', marginRight: 5 }}></div>
                    <small>Income</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ width: 12, height: 12, backgroundColor: '#dc3545', marginRight: 5 }}></div>
                    <small>Expense</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Financial Summary</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-3">
                <h6>Total Turnover: <CurrencyRupee fontSize="small" />{totalTurnOver}</h6>
              </div>
              
              <Row>
                <Col md={6} className="mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h6 className="text-success">
                      <ArrowDropUp /> Income: <CurrencyRupee fontSize="small" />{totalTurnOverIncome}
                    </h6>
                    <CircularProgressBar percentage={turnOverIncomePercent.toFixed(0)} color="#28a745" />
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="d-flex flex-column align-items-center">
                    <h6 className="text-danger">
                      <ArrowDropDown /> Expense: <CurrencyRupee fontSize="small" />{totalTurnOverExpense}
                    </h6>
                    <CircularProgressBar percentage={turnOverExpensePercent.toFixed(0)} color="#dc3545" />
                  </div>
                </Col>
              </Row>
              
              <div className="mt-auto d-flex justify-content-center">
                {totalTurnOver > 0 && (
                  <DonutChart 
                    data={turnoverData}
                    colors={['#28a745', '#dc3545']}
                  />
                )}
              </div>
              
              <div className="text-center mt-2">
                <div className="d-flex justify-content-center">
                  <div className="d-flex align-items-center me-3">
                    <div style={{ width: 12, height: 12, backgroundColor: '#28a745', marginRight: 5 }}></div>
                    <small>Income</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ width: 12, height: 12, backgroundColor: '#dc3545', marginRight: 5 }}></div>
                    <small>Expense</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Monthly Trend Chart */}
      <Row className="mb-5">
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">Monthly Income & Expense Trends</h5>
            </Card.Header>
            <Card.Body className="overflow-auto">
              <div style={{ minHeight: '300px' }}>
                {monthlyChartData.length > 0 ? (
                  <div className="d-flex justify-content-center">
                    <BarChart 
                      data={monthlyChartData} 
                      width={Math.max(500, monthlyChartData.length * 50)} 
                      height={300} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p>No monthly data available</p>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-4">
                <div className="d-flex justify-content-center">
                  <div className="d-flex align-items-center me-3">
                    <div style={{ width: 12, height: 12, backgroundColor: '#28a745', marginRight: 5 }}></div>
                    <small>Income</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ width: 12, height: 12, backgroundColor: '#dc3545', marginRight: 5 }}></div>
                    <small>Expense</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Category Analysis */}
      <Row>
        <Col lg={6} md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Income by Category</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {categories.map(category => {
                  const income = transactions
                    .filter(transaction => transaction.transactionType === "credit" && transaction.category === category)
                    .reduce((acc, transaction) => acc + transaction.amount, 0);
                  
                  const incomePercent = totalTurnOver > 0 ? (income / totalTurnOver) * 100 : 0;

                  return (
                    income > 0 && (
                      <LineProgressBar 
                        key={`income-${category}`} 
                        label={`${category}: ₹${income}`} 
                        percentage={incomePercent.toFixed(0)} 
                        lineColor={colors[category]} 
                      />
                    )
                  );
                })}
              </div>
              
              {incomeByCategory.length > 0 && (
                <div className="mt-4 d-flex justify-content-center">
                  <DonutChart 
                    data={incomeByCategory} 
                    colors={chartColors}
                  />
                </div>
              )}
              
              {incomeByCategory.length > 0 && (
                <div className="mt-2">
                  <div className="d-flex flex-wrap justify-content-center">
                    {incomeByCategory.map((item, index) => (
                      <div key={`legend-income-${index}`} className="d-flex align-items-center mx-2 mb-2">
                        <div 
                          style={{ 
                            width: 12, 
                            height: 12, 
                            backgroundColor: chartColors[index % chartColors.length], 
                            marginRight: 5 
                          }}
                        ></div>
                        <small>{item.name}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} md={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">Expense by Category</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {categories.map(category => {
                  const expense = transactions
                    .filter(transaction => transaction.transactionType === "expense" && transaction.category === category)
                    .reduce((acc, transaction) => acc + transaction.amount, 0);
                  
                  const expensePercent = totalTurnOver > 0 ? (expense / totalTurnOver) * 100 : 0;

                  return (
                    expense > 0 && (
                      <LineProgressBar 
                        key={`expense-${category}`} 
                        label={`${category}: ₹${expense}`} 
                        percentage={expensePercent.toFixed(0)} 
                        lineColor={colors[category]} 
                      />
                    )
                  );
                })}
              </div>
              
              {expenseByCategory.length > 0 && (
                <div className="mt-4 d-flex justify-content-center">
                  <DonutChart 
                    data={expenseByCategory} 
                    colors={chartColors}
                  />
                </div>
              )}
              
              {expenseByCategory.length > 0 && (
                <div className="mt-2">
                  <div className="d-flex flex-wrap justify-content-center">
                    {expenseByCategory.map((item, index) => (
                      <div key={`legend-expense-${index}`} className="d-flex align-items-center mx-2 mb-2">
                        <div 
                          style={{ 
                            width: 12, 
                            height: 12, 
                            backgroundColor: chartColors[index % chartColors.length], 
                            marginRight: 5 
                          }}
                        ></div>
                        <small>{item.name}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;