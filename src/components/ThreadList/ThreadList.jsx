import { Container } from "react-bootstrap";
import './ThreadList.css';
import ThreadCard from "./ThreadCard";


export default function ThreadList({ threads, onSelect }) {
  const handleUpvote = () => {
    alert('Upvote clicked!');
  };
  const handleDownvote = () => {
    alert('Downvote clicked!');
  };

  const cards=threads.map((thread) => {
    return(
      <ThreadCard key={thread._id}
      thread={thread} onSelect={onSelect} />
    )
  });
    

  return (
    <Container fluid className="px-0">
      THREADLIST
      {/* Your Code Here  */}
      {cards}
    </Container>
  );
}
