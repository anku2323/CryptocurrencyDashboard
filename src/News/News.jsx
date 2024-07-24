import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './News.css';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/everything?q=bitcoin&apiKey=029ffefdbafb4e9f8bd4775943fa7076'
        );
        if (response.data && response.data.articles) {
          setArticles(response.data.articles);
          localStorage.setItem('articles', JSON.stringify(response.data.articles));
        }
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching the news articles:', error);
        setLoading(false); 
      }
    };

    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
      setLoading(false); 
    } else {
      fetchData();
    }
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="News">
      <header className="News-header">
        <h1>News</h1>
      </header>
      <main>
        {loading ? (
          <p>Loading news articles...</p>
        ) : (
          articles.length > 0 ? (
            <Slider {...settings}>
              {articles.slice(0, 10).map((article, index) => (
                <div key={index} className="article">
                  <h2>{article.title}</h2>
                  {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </div>
              ))}
            </Slider>
          ) : (
            <p>No news articles found.</p>
          )
        )}
      </main>
    </div>
  );
};

export default News;
