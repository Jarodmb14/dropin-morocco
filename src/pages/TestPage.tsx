const TestPage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1>🧪 Test Page Works!</h1>
      <p>If you can see this, routing is working.</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          ← Back to Home
        </a>
      </div>
    </div>
  );
};

export default TestPage;
