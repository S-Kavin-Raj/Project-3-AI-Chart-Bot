 const API_KEY = "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"; 
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";
    const MODEL = "deepseek/deepseek-r1:free";

    const userInput = document.getElementById("userInput");
    const chatHistory = document.getElementById("response");
    const askButton = document.getElementById("askButton");

    askButton.addEventListener("click", askMentor);
    userInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        askMentor();
      }
    });

    function appendMessage(text, className) {
      const messageElement = document.createElement("div");
      messageElement.className = `message ${className}`;
      messageElement.innerText = text;
      chatHistory.appendChild(messageElement);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    async function askMentor() {
      const input = userInput.value.trim();
      if (!input) return;

      appendMessage(input, "user-message");
      userInput.value = "";
      askButton.disabled = true;

      const thinking = document.createElement("div");
      thinking.className = "message ai-message";
      thinking.innerText = "Thinking...";
      chatHistory.appendChild(thinking);
      chatHistory.scrollTop = chatHistory.scrollHeight;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.href,
            "X-Title": document.title
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: "system", content: "You are a helpful and encouraging AI career mentor." },
              { role: "user", content: input }
            ]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const message = data.choices?.[0]?.message?.content;
        thinking.innerText = message || "Sorry, I couldn't get a response.";
      } catch (error) {
        console.error("API call failed:", error);
        thinking.innerText = "An error occurred. Please try again.";
      } finally {
        askButton.disabled = false;
      }
    }