import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { getImages, searchImages } from '../../actions/home';
import { Grid as GiphyGrid } from '@giphy/react-components';
import ResizeObserver from 'react-resize-observer';
import { Grid, InputBase, makeStyles, Paper } from '@material-ui/core';
import { colSecondary } from '../../helpers/colors';
import { SearchOutlined, TrendingUp } from '@material-ui/icons';
import { Search } from './Search';
import { useHistory } from 'react-router-dom';
import { IconHeader } from '../layout/IconHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '15px',
  },
  input: {
    marginLeft: theme.spacing(1),
    height: '40px',
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  grid: {
    '& img': {
      borderRadius: '15px',
    },
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  },
}));

const Home = ({ getImages, searchImages, setAlert }) => {
  const classes = useStyles();
  const history = useHistory();
  const [width, setWidth] = useState(window.innerWidth);
  const [query, setQuery] = useState('');
  const [displaySearch, setDisplaySearch] = useState(false);

  const GifOverlay = ({ isHovered, gif }) => {
    return <div className={classes.overlay}>{isHovered ? 'View' : ''}</div>;
  };

  useEffect(() => {
    if (query === '') {
      setDisplaySearch(false);
    }
  }, [query]);

  const redirect = (gif) => {
    const gifData = {
      id: gif.id,
      caption: gif.title,
      src: gif.images.original.url,
      importTime: gif.import_datetime,
      trendingTime: gif.trending_datetime,
      hyperlink: gif.bitly_url,
      size: gif.images.original.size,
      userAvatar: gif.user.avatar_url,
      userName: gif.user.display_name,
      userLink: gif.user.profile_url,
      thumbnail: gif.images.downsized.url,
      thumbnailWidth: gif.images.downsized_small.width,
      thumbnailHeight: gif.images.downsized_small.height,
    };

    history.push({
      pathname: `/gif/${gifData.id}`,
      state: gifData,
    });
  };

  return (
    <Grid container alignItems='center' justify='center' alignContent='center'>
      <Grid item style={{ width: '80%' }}>
        <Paper
          style={{
            backgroundColor: colSecondary,
            borderRadius: '15px',
            padding: '10px',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        >
          <Paper className={classes.root}>
            <SearchOutlined fontSize='large' />
            <InputBase
              className={classes.input}
              onInput={(e) => {
                if (!e.target.value !== query) {
                  setDisplaySearch(false);
                  setQuery(e.target.value);
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  setDisplaySearch(true);
                }
              }}
            />
          </Paper>
        </Paper>

        <IconHeader
          icon={TrendingUp}
          subheader={false}
          text={'Trending Gifs'}
        />

        <div
          style={{
            marginBottom: '50px',
          }}
        >
          {displaySearch ? (
            <Search searchQuery={() => searchImages(query)} width={width} />
          ) : (
            <GiphyGrid
              onGifClick={redirect}
              noLink={true}
              width={width}
              fetchGifs={getImages}
              overlay={GifOverlay}
              columns={4}
              gutter={6}
              className={classes.grid}
            />
          )}
        </div>

        <ResizeObserver
          onResize={({ width }) => {
            setWidth(width);
          }}
        />
      </Grid>
    </Grid>
  );
};

Home.propTypes = {
  setAlert: PropTypes.func.isRequired,
  searchImages: PropTypes.func.isRequired,
  getImages: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, getImages, searchImages })(Home);
