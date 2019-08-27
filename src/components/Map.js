import React, { Component } from 'react';
import { Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Lightbox from 'react-native-lightbox';
import * as ImagePicker from 'expo-image-picker';

export default class Map extends Component {
  constructor(props) {
    super( props );
    this.state = {
      locations: [],
      imageSize: { width: 100, height: 100 },
    };
  }

  onLongPressMap = async ( { nativeEvent } ) => {
    const { uri } = await this._pickImage();
    const { coordinate } = nativeEvent;
    const newLocation = {
      ...coordinate,
      image: uri
    };
    const newLocations = [ ...this.state.locations, newLocation ];
    this.setState( {
      locations: newLocations,
    } );
  };

  _pickImage = () => {
    return ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
  };

  onOpenLightbox = () => {
    const { width, height } = Dimensions.get('screen');
    this.setState({
      imageSize: {
        width: width,
        height: height
      }
    })
  };

  onCloseLightbox = () => {
    this.setState({
      imageSize: {
        width: 100,
        height: 100
      }
    })
  };

  renderMarker = () => {
    const { locations } = this.state;
    return locations.map( ( location, index ) => (
      <Marker coordinate={ location } key={ index }>
        <Callout>
          <Lightbox
            onOpen={ this.onOpenLightbox }
            onClose={ this.onCloseLightbox }
          >
            <Image
              source={ { uri: location.image } }
              style={ { height: this.state.imageSize.height, width: this.state.imageSize.width } }
              resizeMode="cover"
            />
          </Lightbox>
        </Callout>
      </Marker>
    ));
  };

  render() {
    const { coords } = this.props.location;
    return (
      <MapView
        initialRegion={ {
            longitude: coords.longitude,
            latitude: coords.latitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }
        }
        onLongPress={ (e) => { this.onLongPressMap( e ); } }
        style={{flex: 1}}
      >
        { this.renderMarker() }
      </MapView>
    );
  }
}
