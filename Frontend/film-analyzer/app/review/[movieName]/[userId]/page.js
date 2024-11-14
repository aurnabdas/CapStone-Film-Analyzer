import Review from '../../../../components/Review';


export default function Page({params}) {
  
  // removes any funny symbols like %20 aka the spaces 
  const movieName = decodeURIComponent(params.movieName);
  const userName = decodeURIComponent(params.userId)
 


  return <Review movieName={movieName} userName={userName}/>;
}