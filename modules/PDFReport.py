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

    def get_data(self):
        data = []
        restricted_keys = ["image", "checked", 
                           "created_by", "device", 
                           "id", "updated_at", 
                           "user", "updated_by",
                           "created_at",
                        ]
        
        allowed_keys = {
            'code': 'Minipillar Code', 
            'manuf_serial_number': 'Manuf Serial Number', 
            'miniPillar_type': 'Minipillar Type', 
            'subtype_cd': 'Subtype CD', 
            'substation_number': 'Substation Number', 
            'feeder_number': 'Feeder Number', 
            'circuits_number': 'Circuits Number', 
            'used_circuits_number': 'Used Circuits Number', 
            'subMiniPilar': 'Sub Minipillar', 
            'manuf_code': 'Manufacturer Code', 
            'manuf_year': 'Manufacturer Year',  
            'entrance_obstacles': 'Entrance is free of obstacles', 
            'equipment_grounding': 'Ensure the Equipment Grounding', 
            'rusted_earthing_connection': 'Rusted Earthing Connection', 
            'availability_noDang_signsMono': 'Availability of No/Dang. Signs/Mono', 
            'substation_cleanliness': 'Substation Cleanless', 
            'equipment_level': 'Equipment Level', 
            'bumt_marks_sparks': 'Check for burnt marks & Sparks', 
            'oxidation_corrosions': 'Check for oxidation & corrosions', 
            'dust_foreignDebris': 'Check dust or foreign debris', 
            'connectors_lugs': 'Connectors & lugs', 
            'bumt_heatingMarksOnCable': 'Burnt or heating marks on cable', 
            'urgent_issue': 'Urgent Issue', 
            'urgent_issue_body': 'Issue Description', 
            'serious_issue': 'Serious Issue', 
            'serious_issue_body': 'Issue Description', 
            'physicalCondition_dent_damages': 'Physical condition, dent, damages', 
            'rust_corrosion_deterioration': 'Check rust, corrosion & deterioration', 
            'paint_condition': 'Check paint condition', 
            'gaps_slots': 'Check gaps and slots', 
            'locks_hinges': 'Check locks and hinges', 
            'latching_mechanism': 'Check latching mechanism', 
            'cracks_damages': 'Check leveling cracks or damages', 
            'gaps_unblockCableEntry': 'Gaps or unblock cable entry', 
            'galvanization_bolts_nuts_screws': 'Galvanization on blots, nuts & screw', 
            'grounding_bounding': 'Grounding & Bounding', 
            'access_obstructions': 'Access obstructions on Mini pillar', 
            'numbering_dangerSigns_monogram': 'Numbering, danger signs, monogran', 
            'maintenance_completed': 'Maintenance Completed', 
            'minorRepair_made': 'Minor Repairs Made', 
            'latitude': "Latitude", 
            'longitude': "Longitude", 
            'last_check_at': 'Last Check', 
            'checked_by': 'Checked By', 
        }

        for key in self._minipillar_obj:
            if key in restricted_keys:
                    pass
            elif key == "last_check_at":
                row = ("{}".format(allowed_keys[key]), "{}".format(self._minipillar_obj[key].replace("T", " ")))
                data.append(row)
            else:
                row = row = ("{}".format(allowed_keys[key]), "{}".format(self._minipillar_obj[key]).replace("true", "yes").replace("false", "no"))
                data.append(row)
                
        
        # print(elements)
        return data
        
    def create_table(self):
        data = self.get_data()
        pdf = FPDF()
        pdf.add_page()
        # create title
        
        
        pdf.set_font("Times", size=10)
        line_height = pdf.font_size * 2.5
        col_width = 95#pdf.epw / 4  # distribute content evenly
        
        pdf.image('temp\\report\\Logo.png', x=10, y=10, w=60, h=20)
        pdf.multi_cell(col_width, line_height, 
                       "", 
                       border=0, 
                       ln=3, 
                       max_line_height=pdf.font_size)
        pdf.multi_cell(col_width, line_height, 
                       "", 
                       border=0, 
                       ln=3, 
                       max_line_height=pdf.font_size)
        pdf.ln(line_height)
        pdf.multi_cell(col_width, line_height, 
                       "", 
                       border=0, 
                       ln=3, 
                       max_line_height=pdf.font_size)
        pdf.multi_cell(col_width, line_height, 
                       "", 
                       border=0, 
                       ln=3, 
                       max_line_height=pdf.font_size)
        pdf.ln(line_height)
        pdf.multi_cell(col_width, line_height, 
                       "", 
                       border=0, 
                       ln=3, 
                       max_line_height=pdf.font_size)
        pdf.multi_cell(col_width, line_height, 
                       "", 
                       border=0, 
                       ln=3, 
                       max_line_height=pdf.font_size)
        pdf.ln(line_height)
        
        for row in data:
            for datum in row:
                # print(datum)
                pdf.multi_cell(col_width, line_height, datum, border=1, ln=3, max_line_height=pdf.font_size)
            pdf.ln(line_height)
            
        
        pdf.set_font(style="I", size=20, )
        pdf.cell(txt="Signature", h = 50)
        output_name = "report"
        output = f'temp/report/{output_name}.pdf'
        pdf.output(output)
        
        return output
    


def main():
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
    
if __name__ == "__main__":
    main()