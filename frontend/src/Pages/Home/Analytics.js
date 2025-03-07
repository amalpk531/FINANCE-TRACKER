import React, { useState } from "react";
import { Container, Row, Col, Card, Nav, Button, Form } from "react-bootstrap";
import { 
  ArrowUp, ArrowDown, Indian, 
  BarChart as BarChartIcon, 
  PieChart, Calendar, Filter
} from "lucide-react";

// Modern circular progress component
const CircularProgress = ({ percentage, color, size = 80 }) => {
  const radius = size / 2;
  const stroke = size / 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="position-relative" style={{ width: size, height: size }}>
      <svg height={size} width={size}>
        <circle
          stroke="#f0f0f0"
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
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <div 
        className="position-absolute d-flex flex-column align-items-center justify-content-center"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <span style={{ fontWeight: "bold", fontSize: `${size/4}px` }}>{percentage}%</span>
      </div>
    </div>
  );
};

// Enhanced line progress bar
const LineProgress = ({ label, value, percentage, color }) => {
  return (
    <div className="my-2">
      <div className="d-flex justify-content-between mb-1">
        <span className="text-truncate" style={{ maxWidth: "60%" }}>{label}</span>
        <span className="text-end ms-2">₹{value.toLocaleString()}</span>
      </div>
      <div className="progress" style={{ height: "8px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color,
            transition: "width 0.5s ease",
            borderRadius: "4px"
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

// Enhanced donut chart with smoother animation and hover effects
const DonutChart = ({ data, colors, width = 200, height = 200 }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
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
          
          // Hover effect
          const isHovered = hoverIndex === i;
          const segmentRadius = isHovered ? radius * 1.05 : radius;
          const segmentInnerRadius = isHovered ? innerRadius * 0.95 : innerRadius;
          
          return (
            <g 
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <path 
                d={path} 
                fill={colors[i % colors.length]}
                opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.7}
                style={{ transition: 'all 0.3s ease' }}
              />
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

// Enhanced bar chart with hover effects and animations
const BarChart = ({ data, width = 500, height = 300 }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const maxValue = Math.max(...data.map(item => item.value)) * 1.1; // 10% headroom
  const barWidth = width / data.length * 0.7;
  const spacing = width / data.length * 0.3;
  const chartHeight = height * 0.75;
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = chartHeight + 20 - (ratio * chartHeight);
        return (
          <g key={i}>
            <line 
              x1={40} 
              y1={y} 
              x2={width - 20} 
              y2={y} 
              stroke="#eee" 
              strokeWidth="1" 
              strokeDasharray={i > 0 ? "5,5" : "0"}
            />
            <text
              x={35}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="10"
              fill="#999"
            >
              {Math.round(maxValue * ratio)}
            </text>
          </g>
        );
      })}
      
      {/* X-axis */}
      <line x1={40} y1={chartHeight + 20} x2={width - 20} y2={chartHeight + 20} stroke="#ccc" strokeWidth="1" />
      
      {/* Bars */}
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = 40 + (barWidth + spacing) * i + spacing / 2;
        const y = chartHeight + 20 - barHeight;
        
        // Hover effect
        const isHovered = hoverIndex === i;
        const barOpacity = hoverIndex === null || hoverIndex === i ? 1 : 0.7;
        
        return (
          <g 
            key={i}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={item.color}
              opacity={barOpacity}
              rx="4"
              ry="4"
              style={{ transition: 'all 0.3s ease' }}
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 40}
              textAnchor="middle"
              fontSize="10"
              fill="#555"
              transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight + 40})`}
            >
              {item.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="10"
              fill="#555"
              fontWeight={isHovered ? "bold" : "normal"}
            >
              {item.value.toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Analytics = ({ transactions }) => {
  // State for active tab and date range
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
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

  // Calculate current balance
  const currentBalance = totalTurnOverIncome - totalTurnOverExpense;
  const balanceStatus = currentBalance >= 0 ? "positive" : "negative";

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
        balance: data.income - data.expense
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
      color: '#4CAF50' 
    });
    monthlyChartData.push({ 
      label: `${item.label} Exp`, 
      value: item.expenseValue, 
      color: '#F44336' 
    });
    // Add balance as a third bar for each month
    monthlyChartData.push({ 
      label: `${item.label} Bal`, 
      value: Math.abs(item.balance), 
      color: item.balance >= 0 ? '#2196F3' : '#FF9800' 
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

  // Generate daily transaction data for the last 30 days
  const getDailyData = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const dailyMap = {};
    
    // Initialize all days with zero values
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
      dailyMap[dateStr] = { income: 0, expense: 0 };
    }
    
    // Fill with actual data
    transactions.forEach(transaction => {
      try {
        const date = new Date(transaction.date);
        // Skip if before 30 days ago
        if (date < thirtyDaysAgo) return;
        
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
        
        if (!dailyMap[dateStr]) {
          dailyMap[dateStr] = { income: 0, expense: 0 };
        }
        
        if (transaction.transactionType === "credit") {
          dailyMap[dateStr].income += transaction.amount;
        } else {
          dailyMap[dateStr].expense += transaction.amount;
        }
      } catch (error) {
        console.error("Error processing date:", error);
      }
    });
    
    // Convert to array and sort
    return Object.entries(dailyMap)
      .map(([date, data]) => ({
        label: date,
        incomeValue: data.income,
        expenseValue: data.expense,
      }))
      .sort((a, b) => {
        const [aDay, aMonth] = a.label.split('/').map(Number);
        const [bDay, bMonth] = b.label.split('/').map(Number);
        return (aMonth - bMonth) || (aDay - bDay);
      });
  };
  
  const dailyData = getDailyData();
  
  // Format for daily chart
  const dailyChartData = [];
  dailyData.forEach(item => {
    if (item.incomeValue > 0 || item.expenseValue > 0) {
      dailyChartData.push({ 
        label: item.label, 
        value: item.incomeValue, 
        color: '#4CAF50' 
      });
      dailyChartData.push({ 
        label: item.label, 
        value: item.expenseValue, 
        color: '#F44336' 
      });
    }
  });

  // Get top 5 income and expense categories
  const getTopCategories = (type, limit = 5) => {
    const categorySums = categories.map(category => {
      const sum = transactions
        .filter(transaction => 
          transaction.transactionType === type && 
          transaction.category === category
        )
        .reduce((acc, transaction) => acc + transaction.amount, 0);
      
      return { category, sum };
    });
    
    return categorySums
      .sort((a, b) => b.sum - a.sum)
      .filter(item => item.sum > 0)
      .slice(0, limit);
  };
  
  const topIncomeCategories = getTopCategories("credit");
  const topExpenseCategories = getTopCategories("expense");

  // Calculate spending insights
  const getSpendingInsights = () => {
    // Find category with highest expense
    const highestExpenseCategory = expenseByCategory.reduce(
      (max, cat) => cat.value > max.value ? cat : max, 
      { name: "", value: 0 }
    );
    
    // Calculate month-over-month change
    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    const currentMonthExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && t.transactionType === "expense";
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const previousMonthExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === previousMonth && t.transactionType === "expense";
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthOverMonthChange = previousMonthExpenses === 0 
      ? 100 
      : ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;
    
    return {
      highestExpenseCategory,
      monthOverMonthChange
    };
  };
  
  const spendingInsights = getSpendingInsights();

  return (
    <Container fluid className="py-4 px-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Financial Analytics</h2>
      </div>
      
      {/* Navigation tabs */}
      <Nav 
        variant="tabs" 
        className="mb-4 border-bottom" 
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Nav.Item>
          <Nav.Link eventKey="overview" className="px-4">Overview</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="income" className="px-4">Income</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="expenses" className="px-4">Expenses</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="trends" className="px-4">Trends</Nav.Link>
        </Nav.Item>
      </Nav>
      
      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Summary Cards */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="shadow-sm h-100 border-0">
                <Card.Body>
                  <h6 className="text-muted mb-2">Current Balance</h6>
                  <h3 className={`mb-0 ${balanceStatus === "positive" ? "text-success" : "text-danger"}`}>
                    ₹{currentBalance.toLocaleString()}
                  </h3>
                  <small className="text-muted">
                    {balanceStatus === "positive" ? "You're in good shape!" : "Watch your spending"}
                  </small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="shadow-sm h-100 border-0">
                <Card.Body>
                  <h6 className="text-muted mb-2">Total Income</h6>
                  <h3 className="text-success mb-0">₹{totalTurnOverIncome.toLocaleString()}</h3>
                  <small className="text-muted">{totalIncomeTransactions.length} transactions</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="shadow-sm h-100 border-0">
                <Card.Body>
                  <h6 className="text-muted mb-2">Total Expenses</h6>
                  <h3 className="text-danger mb-0">₹{totalTurnOverExpense.toLocaleString()}</h3>
                  <small className="text-muted">{totalExpenseTransactions.length} transactions</small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="shadow-sm h-100 border-0">
                <Card.Body>
                  <h6 className="text-muted mb-2">Savings Rate</h6>
                  <h3 className="text-primary mb-0">
                    {totalTurnOverIncome > 0 
                      ? Math.round((totalTurnOverIncome - totalTurnOverExpense) / totalTurnOverIncome * 100) 
                      : 0}%
                  </h3>
                  <small className="text-muted">of total income</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Main Charts */}
          <Row className="mb-4">
            <Col lg={8} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Monthly Income & Expenses</h5>
                    <div className="d-flex">
                      <div className="d-flex align-items-center me-3">
                        <div style={{ width: 12, height: 12, backgroundColor: '#4CAF50', marginRight: 5 }}></div>
                        <small>Income</small>
                      </div>
                      <div className="d-flex align-items-center me-3">
                        <div style={{ width: 12, height: 12, backgroundColor: '#F44336', marginRight: 5 }}></div>
                        <small>Expense</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div style={{ width: 12, height: 12, backgroundColor: '#2196F3', marginRight: 5 }}></div>
                        <small>Balance</small>
                      </div>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="overflow-auto pt-0">
                  <div style={{ minHeight: '300px' }}>
                    {monthlyChartData.length > 0 ? (
                      <div className="d-flex justify-content-start">
                        <BarChart 
                          data={monthlyChartData} 
                          width={Math.max(600, monthlyChartData.length * 40)} 
                          height={300} 
                        />
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <p>No monthly data available</p>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} className="mb-3">
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                  <h5 className="mb-0">Income vs Expense</h5>
                </Card.Header>
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <DonutChart 
                    data={[
                      { name: 'Income', value: totalTurnOverIncome },
                      { name: 'Expense', value: totalTurnOverExpense }
                    ]}
                    colors={['#4CAF50', '#F44336']}
                    width={200}
                    height={200}
                  />
                  
                  <div className="mt-3 text-center">
                    <div className="d-flex justify-content-center mb-2">
                      <div className="d-flex align-items-center me-3">
                        <div style={{ width: 12, height: 12, backgroundColor: '#4CAF50', marginRight: 5 }}></div>
                        <small>Income: ₹{totalTurnOverIncome.toLocaleString()}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div style={{ width: 12, height: 12, backgroundColor: '#F44336', marginRight: 5 }}></div>
                        <small>Expense: ₹{totalTurnOverExpense.toLocaleString()}</small>
                      </div>
                    </div>
                    <small className="text-muted">
                      {totalTurnOverIncome > totalTurnOverExpense 
                        ? `You're saving ${Math.round((totalTurnOverIncome - totalTurnOverExpense) / totalTurnOverIncome * 100)}% of your income`
                        : 'Your expenses exceed your income'}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Category Analysis */}
          <Row>
            <Col lg={6} md={6} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Top Income Sources</h5>
                  </div>
                </Card.Header>
                <Card.Body className="pt-2">
                  <div style={{ height: 'auto', overflowY: 'auto' }} className="mb-3">
                    {topIncomeCategories.map((item, index) => (
                      <LineProgress 
                        key={`income-${index}`} 
                        label={item.category}
                        value={item.sum}
                        percentage={(item.sum / totalTurnOverIncome) * 100}
                        color={colors[item.category]} 
                      />
                    ))}
                  </div>
                  
                  {incomeByCategory.length > 0 && (
                    <div className="d-flex justify-content-center mt-3">
                      <DonutChart 
                        data={incomeByCategory} 
                        colors={chartColors}
                        width={180}
                        height={180}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} md={6} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Top Expense Categories</h5>
                  </div>
                </Card.Header>
                <Card.Body className="pt-2">
                  <div style={{ height: 'auto', overflowY: 'auto' }} className="mb-3">
                    {topExpenseCategories.map((item, index) => (
                      <LineProgress 
                        key={`expense-${index}`} 
                        label={item.category}
                        value={item.sum}
                        percentage={(item.sum / totalTurnOverExpense) * 100}
                        color={colors[item.category]} 
                      />
                    ))}
                  </div>
                  
                  {expenseByCategory.length > 0 && (
                    <div className="d-flex justify-content-center mt-3">
                      <DonutChart 
                        data={expenseByCategory} 
                        colors={chartColors}
                        width={180}
                        height={180}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Insights Card */}
          <Row>
            <Col lg={12} className="mb-4">
              <Card className="shadow-sm border-0 bg-light">
                <Card.Body className="p-4">
                  <h5 className="mb-3">Financial Insights</h5>
                  <Row>
                    <Col md={4} className="mb-3 mb-md-0">
                      <div className="d-flex align-items-center">
                        <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                          <PieChart size={24} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1">Top Expense</h6>
                          <p className="mb-0">
                            {spendingInsights.highestExpenseCategory.name !== "" 
                              ? `${spendingInsights.highestExpenseCategory.name}: ₹${spendingInsights.highestExpenseCategory.value.toLocaleString()}`
                              : "No expense data available"}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                      <div className="d-flex align-items-center">
                        <div className="p-3 rounded-circle bg-warning bg-opacity-10 me-3">
                          <BarChartIcon size={24} className="text-warning" />
                        </div>
                        <div>
                          <h6 className="mb-1">Monthly Change</h6>
                          <p className="mb-0">
                            {spendingInsights.monthOverMonthChange > 0 
                              ? `↑ ${spendingInsights.monthOverMonthChange.toFixed(1)}% from last month`
                              : `↓ ${Math.abs(spendingInsights.monthOverMonthChange).toFixed(1)}% from last month`}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="d-flex align-items-center">
                        <div className="p-3 rounded-circle bg-success bg-opacity-10 me-3">
                          <ArrowUp size={24} className="text-success" />
                        </div>
                        <div>
                          <h6 className="mb-1">Savings Goal</h6>
                          <p className="mb-0">
                            {balanceStatus === "positive" 
                              ? `${Math.round((currentBalance / totalTurnOverIncome) * 100)}% achieved`
                              : "No savings yet"}
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      
      {/* Income Tab */}
      {activeTab === "income" && (
        <Row>
          <Col lg={12} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white pt-4 pb-0 border-bottom-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Income Analysis</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={8}>
                    <h6 className="mb-3">Income by Category</h6>
                    <div style={{ height: '300px', overflowY: 'auto' }}>
                      {incomeByCategory.length > 0 ? (
                        incomeByCategory.map((item, index) => (
                          <LineProgress 
                            key={`income-full-${index}`} 
                            label={item.name}
                            value={item.value}
                            percentage={(item.value / totalTurnOverIncome) * 100}
                            color={chartColors[index % chartColors.length]} 
                          />
                        ))
                      ) : (
                        <p className="text-center py-5">No income data available</p>
                      )}
                    </div>
                  </Col>
                  <Col lg={4}>
                    <h6 className="mb-3">Income Distribution</h6>
                    <div className="d-flex justify-content-center align-items-center h-100">
                      {incomeByCategory.length > 0 ? (
                        <DonutChart 
                          data={incomeByCategory} 
                          colors={chartColors}
                          width={220}
                          height={220}
                        />
                      ) : (
                        <p className="text-center">No income data available</p>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <Row>
          <Col lg={12} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white pt-4 pb-0 border-bottom-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Expense Analysis</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={8}>
                    <h6 className="mb-3">Expenses by Category</h6>
                    <div style={{ height: '300px', overflowY: 'auto' }}>
                      {expenseByCategory.length > 0 ? (
                        expenseByCategory.map((item, index) => (
                          <LineProgress 
                            key={`expense-full-${index}`} 
                            label={item.name}
                            value={item.value}
                            percentage={(item.value / totalTurnOverExpense) * 100}
                            color={chartColors[index % chartColors.length]} 
                          />
                        ))
                      ) : (
                        <p className="text-center py-5">No expense data available</p>
                      )}
                    </div>
                  </Col>
                  <Col lg={4}>
                    <h6 className="mb-3">Expense Distribution</h6>
                    <div className="d-flex justify-content-center align-items-center h-100">
                      {expenseByCategory.length > 0 ? (
                        <DonutChart 
                          data={expenseByCategory} 
                          colors={chartColors}
                          width={220}
                          height={220}
                        />
                      ) : (
                        <p className="text-center">No expense data available</p>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Trends Tab */}
      {activeTab === "trends" && (
        <Row>
          <Col lg={12} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white pt-4 pb-0 border-bottom-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">30-Day Transaction Trends</h5>
                  <div className="d-flex">
                    <div className="d-flex align-items-center me-3">
                      <div style={{ width: 12, height: 12, backgroundColor: '#4CAF50', marginRight: 5 }}></div>
                      <small>Income</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div style={{ width: 12, height: 12, backgroundColor: '#F44336', marginRight: 5 }}></div>
                      <small>Expense</small>
                    </div>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '350px', overflowX: 'auto' }}>
                  {dailyChartData.length > 0 ? (
                    <BarChart 
                      data={dailyChartData} 
                      width={Math.max(800, dailyChartData.length * 20)} 
                      height={300} 
                    />
                  ) : (
                    <div className="text-center py-5">
                      <p>No daily data available for the last 30 days</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Analytics;