(* pp: -parser o -parser op -I /usr/local/lib/ocaml/3.12.1/js_of_ocaml pa_js.cmo *)
module Html = Dom_html

(* utility functions *)
let fmt = Printf.sprintf
let js = Js.string
let doc = Html.document
let log (s:string) = Firebug.console##log(js s)
let now () = Js.to_float ((jsnew Js.date_now())##getTime()) (* new Date().getTime() in JS *) 
let width () = doc##body##clientWidth
let height () = 
   List.fold_left max doc##body##scrollHeight 
    [doc##documentElement##scrollHeight;
    doc##body##offsetHeight; doc##documentElement##offsetHeight;
    doc##body##clientHeight; doc##documentElement##clientHeight]
        
let handle_drag element f =
  element##onmousedown <- Html.handler
    (fun ev ->
       let prev_pos : (int * int) ref = ref (ev##clientX, ev##clientY) 
       and prev_time : float ref = ref (now()) in
       let movehandler =
         Html.addEventListener Html.document Html.Event.mousemove
           (Html.handler
              (fun ev ->
                 let now_pos = (ev##clientX, ev##clientY) 
                 and now_time = now () in
                 f !prev_pos now_pos (now_time -. !prev_time) false;
                 prev_pos := now_pos;
                 prev_time := now();
                 Js._true))
           Js._true
       in
       let uphandler = ref Js.null in
       uphandler := Js.some
         (Html.addEventListener Html.document Html.Event.mouseup
            (Html.handler
               (fun ev ->
                  f !prev_pos (ev##clientX, ev##clientY) (now() -. !prev_time) true;
                  Html.removeEventListener movehandler;
                  Js.Opt.iter !uphandler Html.removeEventListener;
                  Js._true))
            Js._true);
       Js._false)

(* 要素を原点から(x,y)だけ時刻timeかけて平行移動させる *)
let translate ?(time=0.) (elm:#Html.element Js.t) x y : unit=
  (* elm.style['webkitTransitionDuration'] = "..ms"; *)
  Js.Unsafe.set (elm##style) "webkitTransitionDuration" (fmt "%fms" time); 
  (* elm.style['webkitTransitionTimingFunction'] = "linear"; *)
  Js.Unsafe.set (elm##style) "webkitTransitionTimingFunction" "linear"; 
  (* elm.style['webkitTransform'] = "translate(..px,..px)"; *)
  let translate = js(fmt "translate(%dpx,%dpx)" x y) in
  Js.Unsafe.set (elm##style) "webkitTransform" translate; 
  log(Js.to_string translate);
  
type collision = wall * collision_time
and wall = Top | Left | Bottom | Right
and collision_time = float

let sensitivity = 1.

(* (x,y) からスピード (xspeed,yspeed) で直進した時に, *)
(* 壁にぶつかる時刻と位置 (time,x,y) を返す *)
let calc_collision_wall xspeed yspeed x y =
  let width, height = width (), height () in
  if abs_float xspeed < sensitivity && abs_float yspeed < sensitivity then begin
    None
  end else begin
    let xcollision = if xspeed < 0. then (Left, float_of_int x /. (-. xspeed)) 
      else (Right, float_of_int (width - x) /. xspeed)
    and ycollision = if yspeed < 0. then (Top, float_of_int y /. (-. yspeed))
      else (Bottom, float_of_int (height - y) /. yspeed)
    in
    let collision,time = 
      match xcollision,ycollision with
      | (_,xtime),(_,ytime) when xtime<ytime -> xcollision
      | _ -> ycollision
    in 
    let targetx, targety = 
      match collision with
      | Top -> (x + int_of_float (xspeed *. time), 0)
      | Left -> (0, y + int_of_float (yspeed *. time))
      | Bottom -> (x + int_of_float (xspeed *. time), height)
      | Right -> (width, y + int_of_float (yspeed *. time))
    in Some(time,targetx,targety)
  end


let start _ =
  let elm = Js.Opt.get (doc##getElementById(js"ball")) (fun () -> failwith "ball not found") in
  let xspeed, yspeed = ref 0., ref 0. 
  in 
  handle_drag elm (fun (x1,y1) (x2,y2) time mouseup ->
    if not mouseup then begin
      xspeed := float_of_int (x2-x1) /. time;
      yspeed := float_of_int (y2-y1) /. time;
      translate elm x2 y2;
    end else begin
      match calc_collision_wall !xspeed !yspeed x2 y2 with
      | None -> ()
      | Some(time,targetx,targety) -> translate ~time elm targetx targety
    end);
  Js._false
;;

Html.window##onload <- Html.handler start
