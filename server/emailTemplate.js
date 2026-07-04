export const generateEmailTemplate = ({
  summary,
  flashcards,
  quiz,
  chatHistory,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{
    font-family:Arial,sans-serif;
    background:#f4f6f8;
    padding:30px;
}
.container{
    max-width:800px;
    margin:auto;
    background:#fff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 0 10px rgba(0,0,0,.1);
}
.header{
    background:linear-gradient(90deg,#4F46E5,#9333EA);
    color:white;
    text-align:center;
    padding:30px;
}
.section{
    padding:25px;
    border-bottom:1px solid #eee;
}
.section h2{
    color:#4F46E5;
}
.footer{
    text-align:center;
    padding:20px;
    background:#f9fafb;
    color:#777;
}
pre{
    white-space:pre-wrap;
    font-family:inherit;
}
</style>
</head>

<body>

<div class="container">

<div class="header">
<h1>📚 Study Buddy AI Report</h1>
<p>Your AI generated study material is ready!</p>
</div>

<div class="section">
<h2>📝 Summary</h2>
<pre>${summary}</pre>
</div>

<div class="section">
<h2>🧠 Flashcards</h2>
<pre>${flashcards}</pre>
</div>

<div class="section">
<h2>❓ Quiz</h2>
<pre>${quiz}</pre>
</div>

<div class="section">
<h2>💬 Chat History</h2>
<pre>${chatHistory}</pre>
</div>

<div class="footer">
Generated with ❤️ by <strong>Study Buddy AI</strong><br/>
Happy Learning 🚀
</div>

</div>

</body>
</html>
`;
};