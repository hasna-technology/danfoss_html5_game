import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralService } from '../service/general.service';
import { moveIn, fallIn } from '../router.animations';
import anime from 'animejs';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})
export class AssessmentComponent implements OnInit {
  
  private routeSub: Subscription;
  constructor(private router: Router, private route: ActivatedRoute, private service:GeneralService) { }
  id;
  ref_arr;
  ref_name;
  
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      console.log(params) //log the entire params object
      
      this.ref_name = params['ref'];
      this.id = params['id'];
      //this.ref_arr = this.service.get_mbp(this.id);
      console.log(this.ref_name) //log the value of id
      if(this.ref_name == "mbp"){
        this.ref_arr = this.service.get_mbp(this.id);
      }else{
        this.ref_arr = this.service.get_lbp(this.id);
      }

    });
    
 

  }
  
  left;
  top;
  selected_quiz;
  showPopup = false;
  onclick(q, event){
    this.selected_quiz = q;
    this.top = event.target.offsetTop - 30;
    if(this.selected_quiz.position == "left"){
      this.left = event.target.offsetLeft - 330;
    }else{
      this.left = event.target.offsetLeft + 60;
    }
    this.showPopup = true;
    
  }
  nextEnable = false;
  onSubmit(quiz){
    console.log(this.selected_quiz.userchoice, this.ref_arr)
    var cnt = 0;
    //var score = 0;
    this.ref_arr.score = 0;
    for(var i =0 ; i<this.ref_arr.quiz.length;i++)
    {
      if(this.ref_arr.quiz[i].userchoice != undefined)
      {
        cnt++;
        this.ref_arr.score += this.ref_arr.quiz[i].choices[this.ref_arr.quiz[i].userchoice].score;
      }
    }
    this.service.setSetScore(this.ref_arr.score);
    this.selected_quiz.completed = true;
    //console.log(this.selected_quiz);
    this.ref_arr.completed = true;
    //console.log(this.ref_arr );
    console.log(this.ref_arr.quiz.length + " == " +  cnt);
    if(this.ref_arr.quiz.length ==  cnt){
      this.nextEnable = true;
      this.ref_arr.completed = true;
    }
    this.showPopup = false;
  }

  onNext(){
   
    let new_id = (Number(this.id) + 1);
    /*
    if(this.ref_name == "mbp"){
      if(new_id > this.service.get_length(this.service.get_mbp())-1){
        this.router.navigateByUrl('/start');
        return;
      }
    }else{
      if(new_id > this.service.get_length(this.service.get_lbp())-1){
        this.router.navigateByUrl('/start');
        return;
      }
    }
    anime({
      targets: '.assess',
      translateX: [200, 0],
      opacity: [0, 1],
      delay: function(el, i, l) {
        return i * 500;
      },
      easing: 'linear',
      duration: 500
  });

    this.router.navigateByUrl('/assessment/'+this.ref_name + "/" + new_id);*/
    let next_state = this.service.getAssessmentNextState(this.ref_name);
    console.log("next_state = "+next_state);
    if(next_state == "score")
    {
      this.router.navigateByUrl('/score');
    }else
    {
      this.router.navigateByUrl('/start/'+next_state + "/" + new_id);
    }
  }
  getContent(id){
    //console.log(id);
    return this.service._content[id];
  }
  noThanks(){
    this.router.navigateByUrl('/information');
  }
  
}
