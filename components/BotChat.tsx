// "use client";

// import React from "react";

// import { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   Container,
//   TextField,
//   IconButton,
//   Paper,
//   Typography,
//   Avatar,
//   AppBar,
//   Toolbar,
//   ThemeProvider,
//   createTheme,
//   CssBaseline,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import PersonIcon from "@mui/icons-material/Person";
// import { VscChromeMinimize } from "react-icons/vsc";
// import { useSelector } from "react-redux";

// interface Message {
//   text: string;
//   isBot: boolean;
//   timestamp: Date;
// }

// interface ChatMessage {
//   text: string;
//   isBot: boolean;
// }

// // const generateBotResponse = async (history: ChatMessage[]): Promise<Message | null> => {
// //   const roleContext = `You are a knowledgeable skincare and beauty e-commerce assistant. Your expertise includes:
// //     - Skincare products and ingredients
// //     - Skin types and concerns
// //     - Product recommendations
// //     - Beauty routines and regimens
// //     - Order status and shipping information
// //     - Returns and refunds
// //     - Product availability and pricing
// //     - Skincare tips and best practices

// //     Always provide accurate, helpful information and maintain a professional yet friendly tone.
// //     When recommending products, use the information from our product catalog.
// //     If a product is not in stock, inform the customer and suggest alternatives.`;
// //   const contents = [
// //     {
// //       role: "user",
// //       parts: [{ text: roleContext }],
// //     },
// //     ...history.map((msg) => ({
// //       role: msg.isBot ? "model" : "user",
// //       parts: [{ text: msg.text }],
// //     })),
// //   ];

// //   const requestOptions = {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({ contents }),
// //   };

// //   try {
// //     const response = await fetch(
// //       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBG6YIbg_bZJCsonRSBfmGdT8jt7aay788",
// //       requestOptions
// //     );
// //     const data = await response.json();
// //     if (!response.ok) throw new Error(data.error?.message || "Something went wrong!");

// //     if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
// //       return {
// //         text: data.candidates[0].content.parts[0].text,
// //         isBot: true,
// //         timestamp: new Date(),
// //       };
// //     }
// //     return null;
// //   } catch (error) {
// //     console.error(error);
// //     return null;
// //   }
// // };

// const generateBotResponse = async (
//   history: ChatMessage[]
// ): Promise<Message | null> => {
//   const roleContext = `Chào mừng bạn đến với cửa hàng mỹ phẩm trực tuyến của chúng tôi! Tôi là trợ lý ảo chuyên về chăm sóc da và làm đẹp. Tôi có thể giúp bạn:
//     - Tìm kiếm thông tin sản phẩm
//     - Số điện thoại liên hệ của website là : 0768838547
//     - Tư vấn về các vấn đề da và loại da
//     - Đề xuất các sản phẩm phù hợp
//     - Hướng dẫn các bước chăm sóc da
//     - Giải đáp các thắc mắc về giá cả và tình trạng sản phẩm
//     - Chia sẻ các mẹo và bí quyết chăm sóc da hiệu quả

//     Luôn cung cấp thông tin chính xác, hữu ích và giữ thái độ chuyên nghiệp nhưng thân thiện.
//     Khi đề xuất sản phẩm, hãy sử dụng thông tin từ danh mục sản phẩm của chúng tôi.
//     Nếu sản phẩm hết hàng, hãy thông báo cho khách hàng và đề xuất các sản phẩm thay thế.


//     Product Catalog:
//     ${JSON.stringify([
//       {
//         name: "Sữa Rửa Mặt La Roche-Posay Effaclar Purifying Foaming Gel 200ML",
//         price: 390000,
//         description:
//           "Sữa Rửa Mặt La Roche-Posay Dạng Gel Cho Da Dầu Mụn là sữa rửa mặt giúp nhẹ nhàng làm sạch bụi bẩn và bã nhờn dư thừa.",
//         skinType: "Da Dầu",
//       },
//       {
//         name: "Kem Chống Nắng Cho Da Dầu, Mụn Bioderma Photoderm AKN Mat SPF30 40ml",
//         price: 430000,
//         description:
//           "Sản phẩm mang lại hiệu quả 2 trong 1 chỉ số chống nắng cao và ngăn ngừa sự phát triển của mụn với kết cấu mịn màng, không màu, không bết dính hay để lại vệt trắng.",
//         skinType: "Da Dầu",
//       },
//       {
//         name: "Tẩy Da Chết Dear, Klairs Gentle Black Sugar Facial Polish 60g",
//         price: 430000,
//         description:
//           "Tẩy tế bào da chết Klairs Gentle Black Sugar với những thành phần tự nhiên. Sản phẩm giúp chị em tẩy hết các tế bào da chết trên da mặt khiến da nhẹ hơn và sáng hơn.",
//         skinType: "Da Dầu",
//       },
//       {
//         name: "Sữa Tắm & Rửa Mặt La Roche-Posay Cho Da Khô Nhạy Cảm 200ml",
//         price: 415000,
//         description:
//           "La Roche-Posay Lipikar Syndet AP+\nLa Roche-Posay Lipikar Syndet AP+ là sản phẩm thuộc dòng Lipikar của thương hiệu dược mỹ phẩm La Roche-Posay từ Pháp.",
//         skinType: "Da Khô",
//       },
//       {
//         name: "Dưỡng Ẩm Nâng Tone Hỗ Trợ Dưỡng Da Sáng Mịn Innisfree 50ml",
//         price: 459000,
//         description:
//           "Kem Dưỡng Nâng Tone Hỗ Trợ Dưỡng Da Sáng Mịn Innisfree Jeju Cherry Blossom Tone-up Cream là kem dưỡng thuộc thương hiệu Innisfree với các chiết xuất thiên nhiên vừa giúp da dưỡng ẩm.",
//         skinType: "Da Nhạy Cảm",
//       },
//     ])}`;

//   const contents = [
//     {
//       role: "user",
//       parts: [{ text: roleContext }],
//     },
//     ...history.map((msg) => ({
//       role: msg.isBot ? "model" : "user",
//       parts: [{ text: msg.text }],
//     })),
//   ];

//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ contents }),
//   };

//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBG6YIbg_bZJCsonRSBfmGdT8jt7aay788", // Replace with your API key
//       requestOptions
//     );
//     const data = await response.json();
//     if (!response.ok)
//       throw new Error(data.error?.message || "Something went wrong!");

//     if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
//       return {
//         text: data.candidates[0].content.parts[0].text,
//         isBot: true,
//         timestamp: new Date(),
//       };
//     }
//     return null;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// function BotChat() {
//   const user = useSelector((state: any) => state.user);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [iconShow, setIconShow] = useState(true);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     const welcomeMessage: Message = {
//       text: `Chào mừng ${user?.fullName} đến với Aureum cửa hàng mỹ phẩm trực tuyến của chúng tôi! Tôi là AI Đẹp trai có thể giúp gì cho bạn? `,
//       isBot: true,
//       timestamp: new Date(),
//     };
//     setMessages([welcomeMessage]);
//   }, []);

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const newMessage: Message = {
//       text: inputMessage,
//       isBot: false,
//       timestamp: new Date(),
//     };

//     setMessages([...messages, newMessage]);
//     setInputMessage("");

//     const botResponse = await generateBotResponse([...messages, newMessage]);
//     if (botResponse) {
//       setMessages((prev) => [...prev, botResponse]);
//     }
//   };

//   const handleKeyPress = (event: React.KeyboardEvent) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const toggleChat = () => {
//     setIsChatOpen(!isChatOpen);
//     setIconShow(!iconShow);
//   };

//   return (
//     <div className="">
//       <CssBaseline />
//       {isChatOpen && (
//         <Box
//           sx={{
//             background: "white",
//             position: "fixed",
//             bottom: "50%",
//             right: 20,
//             transform: "translateY(80%)",
//             width: 380,
//             height: "60vh",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <AppBar position="static" sx={{ height: "60px" }}>
//             <Toolbar
//               sx={{
//                 minHeight: "30px",
//                 alignItems: "center",
//                 bgcolor: "#2d2d2b",
//               }}
//             >
//               {" "}
//               {/* Căn giữa nội dung */}
//               <SmartToyIcon
//                 sx={{ mr: 2, fontSize: "1.2rem", bgcolor: "#2d2d2b" }}
//               />
//               <Typography
//                 sx={{
//                   width: "100%",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//                 variant="body1"
//                 component="div"
//               >
//                 ChatBot
//                 <VscChromeMinimize
//                   onClick={toggleChat}
//                   style={{ cursor: "pointer" }}
//                 />
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           <Container
//             maxWidth="md"
//             sx={{
//               height: "50vh",
//               flex: 1,
//               py: 2,
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <Paper
//               elevation={3}
//               sx={{
//                 background: "white",
//                 flex: 1,
//                 display: "flex",
//                 flexDirection: "column",
//                 overflow: "hidden",
//                 mb: 2,
//                 backgroundColor: "white",
//               }}
//             >
//               <Box
//                 sx={{
//                   height: "calc(50vh - 40px)",
//                   overflow: "auto",
//                   p: 2,
//                   "&::-webkit-scrollbar": {
//                     width: "8px",
//                   },
//                   "&::-webkit-scrollbar-track": {
//                     background: "#f1f1f1",
//                     borderRadius: "4px",
//                   },
//                   "&::-webkit-scrollbar-thumb": {
//                     background: "#888",
//                     borderRadius: "4px",
//                     "&:hover": {
//                       background: "#555",
//                     },
//                   },
//                 }}
//               >
//                 {messages.map((message, index) => (
//                   <Box
//                     key={index}
//                     sx={{
//                       display: "flex",
//                       justifyContent: message.isBot ? "flex-start" : "flex-end",
//                       mb: 1,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "flex-start",
//                         width: "100%",
//                       }}
//                     >
//                       {message.isBot && (
//                         <Avatar
//                           sx={{
//                             mr: 1,
//                             bgcolor: "#2d2d2b",
//                             width: "24px",
//                             height: "24px",
//                           }}
//                         >
//                           <SmartToyIcon sx={{ fontSize: "1.2rem" }} />
//                         </Avatar>
//                       )}
//                       <Paper
//                         elevation={1}
//                         sx={{
//                           p: 1,
//                           backgroundColor: message.isBot
//                             ? "grey.100"
//                             : "primary.main",
//                           color: message.isBot ? "text.primary" : "white",
//                           borderRadius: 2,
//                           width: "100%",
//                         }}
//                       >
//                         <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
//                           {message.text}
//                         </Typography>
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             display: "block",
//                             mt: 0.5,
//                             opacity: 0.7,
//                             fontSize: "0.8rem",
//                           }}
//                         >
//                           {message.timestamp.toLocaleTimeString()}
//                         </Typography>
//                       </Paper>
//                       {!message.isBot && (
//                         <Avatar
//                           sx={{
//                             ml: 1,
//                             bgcolor: "#2d2d2b",
//                             width: "24px",
//                             height: "24px",
//                           }}
//                         >
//                           <PersonIcon sx={{ fontSize: "1.2rem" }} />
//                         </Avatar>
//                       )}
//                     </Box>
//                   </Box>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </Box>
//             </Paper>

//             <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 placeholder="Type your message..."
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 multiline
//                 maxRows={4}
//               />
//               <IconButton
//                 color="primary"
//                 onClick={handleSendMessage}
//                 sx={{
//                   justifyContent: "center",
//                   alignSelf: "flex-end",
//                   backgroundColor: "#747272",
//                   color: "white",
//                   "&:hover": {
//                     backgroundColor: "#747272",
//                   },
//                 }}
//               >
//                 <SendIcon />
//               </IconButton>
//             </Box>
//           </Container>
//         </Box>
//       )}

//       <IconButton
//         onClick={toggleChat}
//         sx={{
//           position: "fixed",
//           bottom: "40%",
//           right: 20,
//           transform: "translateY(50%)",
//           bgcolor: "#2d2d2b",
//           color: "white",
//           display: `${iconShow ? "in-line" : "none"}`,
//           "&:hover": {
//             backgroundColor: "#747272",
//           },
//         }}
//       >
//         <SmartToyIcon />
//       </IconButton>
//     </div>
//   );
// }
// export default BotChat;
