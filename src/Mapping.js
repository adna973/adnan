
import React from "react";
import RestaurantIcon from '@material-ui/icons/Restaurant';
import AddIcon from '@material-ui/icons/Add';
import SchoolIcon from '@material-ui/icons/School';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import LocalFloristIcon from '@material-ui/icons/LocalFlorist';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import ApartmentIcon from '@material-ui/icons/Apartment';
import CategoryIcon from '@material-ui/icons/Category';
import PoolIcon from '@material-ui/icons/Pool';
import CakeIcon from '@material-ui/icons/Cake';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import indigo from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import brown from '@material-ui/core/colors/brown';
import cyan from '@material-ui/core/colors/cyan';
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';
import teal from '@material-ui/core/colors/teal';
import CodeIcon from '@material-ui/icons/Code';

const mapping = {
    "bakery": {
        icon: <CakeIcon style={{
            color: amber[500],
            margin: "2px"
        }} />,
        color: amber[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("shop") && tags.shop === "bakery")
        },
        query: '["shop"="bakery"]'
    },
    "college": {
        icon: <ApartmentIcon style={{
            color: grey[900],
            margin: "2px"
        }} />,
        color: grey[900],
        tags: function (tags) {
            return (tags.hasOwnProperty("amenity") && tags.amenity === "college")
        },
        query: '["amenity"="college"]'
    },
    "kindergarten": {
        icon: <ChildCareIcon style={{
            color: pink[500],
            margin: "2px"
        }} />,
        color: pink[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("amenity") && tags.amenity === "kindergarten")
        },
        query: '["amenity"="kindergarten"]'
    },
    "school": {
        icon: <SchoolIcon style={{
            color: cyan[500],
            margin: "2px"
        }} />,
        color: cyan[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("amenity") && tags.amenity === "school")
        },
        query: '["amenity"="school"]'
    },
    "supermarket": {
        icon: <LocalGroceryStoreIcon style={{
            color: brown[500],
            margin: "2px"
        }} />,
        color: brown[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("shop") && tags.shop === "supermarket")
        },
        query: '["shop"="supermarket"]'
    },
    "swimming": {
        icon: <PoolIcon style={{
            color: indigo[500],
            margin: "2px"
        }} />,
        color: indigo[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("sport") && tags.sport === "swimming")
        },
        query: '["sport"="swimming"]'
    },
    "cinema": {
        icon: <LocalMoviesIcon style={{
            color: purple[500],
            margin: "2px"
        }} />,
        color: purple[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("amenity") && tags.amenity === "cinema")
        },
        query: '["amenity"="cinema"]'
    },
    "playground": {
        icon: <CategoryIcon style={{
            color: teal[500],
            margin: "2px"
        }} />,
        color: teal[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("leisure") && tags.leisure === "playground")
        },
        query: '["leisure"="playground"] ["access"!="private"]'
    },
    "park": {
        icon: <LocalFloristIcon style={{
            color: green[500],
            margin: "2px"
        }} />,
        color: green[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("leisure") && tags.leisure === "park")
        },
        query: '["leisure"="park"]'
    },
    "pharmacy": {
        icon: <LocalPharmacyIcon style={{
            color: red[500],
            margin: "2px"
        }} />,
        color: red[500],
        tags: function (tags) {
            return (tags.hasOwnProperty("amenity") && tags.amenity === "pharmacy")
        },
        query: '["amenity"="pharmacy"]'
    },
    "chemist": {
        icon: <AddShoppingCartIcon style={{
            color: red[100],
            margin: "2px"
        }} />,
        color: red[100],
        tags: function (tags) {
            return (tags.hasOwnProperty("shop") && tags.shop === "chemist")
        },
        query: '["shop"="chemist"]'
    }
}

const overpassQuery = function (types) {
    var query = "[timeout:25] [out:json] ; (";
    types.forEach(type => {
        query += "\n  nwr " + mapping[type].query + " (around:<RANGE>,<LAT>,<LON>);";
    });
    query += ");  out center;  >; out skel qt;";
    return query;
}

const getAllTypes = function () {
    return Object.keys(mapping);
}

const typeIconMapper = function (type) {
    if (type === "position") {
        return <AddIcon style={{
            color: typeColorMapper(type)
        }} />;
    } if (type === "center") {
        return <CodeIcon style={{
            color: typeColorMapper(type)
        }} />;
    } if (type === "unknown") {
        return <TurnedInIcon style={{
            color: typeColorMapper(type),
            margin: "2px"
        }} />
    }
    if (mapping.hasOwnProperty(type))
        return mapping[type].icon;
    else
        return <TurnedInNotIcon style={{
            color: typeColorMapper(type),
            margin: "2px"
        }} />;
}

const typeColorMapper = function (type) {
    if (type === "position") {
        return blue[500];
    } if (type === "center") {
        return blue[500];
    }
    if (mapping.hasOwnProperty(type))
        return mapping[type].color;
    else
        return grey[900];
}

const tagTypeMapper = function (tags) {
    var foundType = "unknown";
    Object.keys(mapping).forEach(function (type) {
        if (mapping[type].tags(tags)) {
            foundType = type;
            return;
        }
    });
    return foundType;
}

export {
    typeIconMapper, typeColorMapper, tagTypeMapper, overpassQuery, getAllTypes
};