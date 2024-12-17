import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

// eslint-disable-next-line react/prop-types
const Prayer = ({name, time, image}) => {
  return (
    <Card sx={{ 
        flex: '1 1 10rem'
     }}>
      <CardMedia
        sx={{ height: '10rem' }}
        image={image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="h2" sx={{ color: 'text.secondary' }}>
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Prayer;