var markers = [];

var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(37.379519, 126.928303),
    level: 3
};
var map = new kakao.maps.Map(container, options);

// 공통 객체
var marker = new kakao.maps.Marker();
var geocoder = new kakao.maps.services.Geocoder();
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
marker.setMap(map);

// 지도 컨트롤
map.addControl(new kakao.maps.MapTypeControl(), kakao.maps.ControlPosition.TOPRIGHT);
map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);

// 지도 클릭 시 마커 이동 + 주소 표시
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
    var latlng = mouseEvent.latLng;
    marker.setPosition(latlng);
    marker.setMap(map);

    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var roadAddr = result[0].road_address?.address_name || '(도로명 주소 없음)';
            var jibunAddr = result[0].address.address_name;

            document.getElementById("clickLatlng").innerHTML =
                `위도: ${latlng.getLat()}<br>경도: ${latlng.getLng()}<br>` +
                `도로명 주소: ${roadAddr}<br>지번 주소: ${jibunAddr}`;

            var content = `
                <div class="infowindow-content">
                    ${roadAddr}<br>${jibunAddr}
                </div>`;
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }
    });
});

// 장소 검색
var ps = new kakao.maps.services.Places();

function searchPlaces() {
    var keyword = document.getElementById('keyword').value;
    if (!keyword.trim()) {
        alert('키워드를 입력해주세요!');
        return false;
    }
    ps.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
        displayPagination(pagination);
    } else {
        alert(status === kakao.maps.services.Status.ZERO_RESULT
            ? '검색 결과가 존재하지 않습니다.'
            : '검색 중 오류가 발생했습니다.');
    }
}

function displayPlaces(places) {
    var listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds();

    removeAllChildNods(listEl);
    removeMarker();

    for (let i = 0; i < places.length; i++) {
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i),
            itemEl = getListItem(i, places[i]);

        bounds.extend(placePosition);

        itemEl.onclick = function () {
            map.panTo(placePosition); // 부드럽게 해당 위치로 이동
            displayInfowindow(marker, places[i].place_name);
        };

        fragment.appendChild(itemEl);
    }

    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
    map.setBounds(bounds);
}

function getListItem(index, places) {
    var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
            '<div class="info">' +
            '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
            '   <span class="jibun gray">' + places.address_name + '</span>';
    } else {
        itemStr += '    <span>' + places.address_name + '</span>';
    }

    itemStr += '  <span class="tel">' + places.phone + '</span>' + '</div>';
    el.innerHTML = itemStr;
    el.className = 'item';
    return el;
}

function addMarker(position, idx) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
        imageSize = new kakao.maps.Size(36, 37),
        imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691),
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
            offset: new kakao.maps.Point(13, 37)
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position,
            image: markerImage
        });

    marker.setMap(map);
    markers.push(marker);
    return marker;
}

function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment();

    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (let i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = function (e) {
                e.preventDefault();
                pagination.gotoPage(i);
            };
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

function displayInfowindow(marker, title) {
    var content = `<div class="infowindow-content">${title}</div>`;
    infowindow.setContent(content);
    infowindow.open(map, marker);
}

function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}
