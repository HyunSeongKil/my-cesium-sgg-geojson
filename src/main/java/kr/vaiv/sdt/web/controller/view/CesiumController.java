package kr.vaiv.sdt.web.controller.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/cesium")
public class CesiumController {
    
    @GetMapping("/detail")
    public String detailCesium(){

        return "cesium/detail";
    }

    @GetMapping("/sgg")
    public String geojsonDemo(){
        return "cesium/sgg";
    }
}
