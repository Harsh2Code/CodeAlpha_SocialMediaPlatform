import { Button } from "/src/components/ui/button.jsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card.jsx"
import { Input } from "/src/components/ui/input.jsx"
import { Label } from "/src/components/ui/label.jsx"

export function LoginForm({ className, ...props }) {
  return (
    <div className={`h-96 w-[400px] flex flex-col mx-auto gap-6 border-1 rounded-[0.5vw] ${className}`} {...props} style={{height: '450px', borderColor:"#6563f1bc" }}>
      <Card >
        <CardHeader className="text-center gap-3 text-inidigo-600" style={{marginTop: '40px'}}>
          <CardTitle className="text-xl text-indigo-600" style={{color: "#6663f1"}}>Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6 mt-2">
              <div className="mt-2 grid gap-3 has-[input:focus-within]:outline-indigo-600">
                <Label className="mt-[40px] ml-[2%] " htmlFor="email" style={{color: "#6663f1"}}>Email</Label>
                  <input 
                  id="email" 
                  type="email" 
                  name="email" 
                  required autocomplete="email"
                 class="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 
                 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 
                 focus:outline-indigo-600 sm:text-sm/6" 
                 style={{borderRadius:'8px'}}
                 />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label className="mt-[20px] ml-[2%]" htmlFor="password" style={{color: "#6663f1"}}>Password</Label>
                  <a
                    href="#"
                    className="ml-auto mt-[20px] text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                  <input 
                  id="password" 
                  type="password" 
                  name="email" 
                  required autocomplete="email"
                 class="block w-[96%] h-[1.5rem] mx-auto mt-[10px] mb-[20px] border bg-white px-3 py-1.5 text-white text-gray-900 outline-1 
                 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 
                 focus:outline-indigo-600 sm:text-sm/6" 
                 style={{borderRadius:'8px',}}
                 />
              </div>
              <Button type="submit" className="w-full my-[20px]">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="my-auto text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
