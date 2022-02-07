from prettytable import PrettyTable
from fpdf import Template, FPDF


class PDFReport:
    """Handle all pdf report proccess"""
    
    def __init__(self, minipillar_obj):
        self._minipillar_obj = minipillar_obj
        
    # Methods
    def get_minipillar_object(self):
        return self._minipillar_obj
    
    def is_checked(self):
        return self._minipillar_obj["checked"]
    
    def get_user(self):
        if self.is_checked():
            return(self._minipillar_obj["checked_by"])
        else:
            return("this minipillar is not checked")
        
    def create_table_instance(self):
        table_instance = PrettyTable()
        return table_instance
    

    def get_data(self):
        data = []
        factor = 0
        for key in self._minipillar_obj:
            if key == "image" or key ==  "checked" or key == "created_by" or key =="device" or key == "id" \
                or key == "updated_at" or key == "user" or key == "updated_by" or key == "created_at":
                    pass
            elif key == "last_check_at":
                row = row = ("{}".format(key), "{}".format(self._minipillar_obj[key].replace("T", " ")))
                data.append(row)
            else:
                row = row = ("{}".format(key), "{}".format(self._minipillar_obj[key]))
                data.append(row)
                
        
        # print(elements)
        return data
        
    def create_table(self):
        data = self.get_data()
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Times", size=10)
        line_height = pdf.font_size * 2.5
        col_width = 95#pdf.epw / 4  # distribute content evenly
        for row in data:
            for datum in row:
                pdf.multi_cell(col_width, line_height, datum, border=1, ln=3, max_line_height=pdf.font_size)
            pdf.ln(line_height)
            
        
        pdf.set_font(style="I", size=20, )
        pdf.cell(txt="Signature", h = 50)
        pdf.output('table_with_cells.pdf')
    
    
    
if __name__ == "__main__":
    minipillar_obj = {'id': 1, 
    'checked': True, 
    'image': '/media/minipillar/upload/imgs/putty_err0_QZWQeVU.PNG', 
    'code': 'string', 
    'manuf_serial_number': 'string', 
    'miniPillar_type': 'string', 
    'subtype_cd': 'string', 
    'substation_number': 'string', 
    'feeder_number': 'string', 
    'circuits_number': 'string', 
    'used_circuits_number': 'string', 
    'subMiniPilar': 'string', 
    'manuf_code': '', 'manuf_year': '', 
    'created_at': '2022-01-06T15:08:17.561729', 
    'user': 'admin', 
    'updated_at': '2022-02-02T19:16:37.026153', 
    'updated_by': None, 
    'entrance_obstacles': 'false', 
    'equipment_grounding': 'false', 
    'rusted_earthing_connection': 'false', 
    'availability_noDang_signsMono': 'false', 
    'substation_cleanliness': 'false', 
    'equipment_level': 'false', 
    'bumt_marks_sparks': 'false', 
    'oxidation_corrosions': 'false', 
    'dust_foreignDebris': 'true', 
    'connectors_lugs': 'false', 
    'bumt_heatingMarksOnCable': 'false', 
    'urgent_issue': 'false', 
    'urgent_issue_body': 'string', 
    'serious_issue': 'false', 
    'serious_issue_body': 'string', 
    'physicalCondition_dent_damages': 'string', 
    'rust_corrosion_deterioration': 'string', 
    'paint_condition': 'string', 
    'gaps_slots': 'string', 
    'locks_hinges': 'string', 
    'latching_mechanism': 'string', 
    'cracks_damages': 'string', 
    'gaps_unblockCableEntry': 'string', 
    'galvanization_bolts_nuts_screws': 'string', 
    'grounding_bounding': 'string', 
    'access_obstructions': 'string', 
    'numbering_dangerSigns_monogram': 'string', 
    'maintenance_completed': 'string', 
    'minorRepair_made': 'string', 
    'latitude': 24.157770906967517, 
    'longitude': 47.340020713404606, 
    'last_check_at': '2022-02-02T19:16:37.027152', 
    'checked_by': 'string', 
    'device': 5, 
    'created_by': 1}
    
    
pdfclass = PDFReport(minipillar_obj)
pdfclass.create_table()