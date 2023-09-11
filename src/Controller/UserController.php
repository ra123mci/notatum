<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class UserController extends AbstractController
{
    #[Route('/profile', name: 'app_profile')]
    public function index(): Response
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    #[Route('/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        return $this->render('user/login.html.twig', [
            'error' => $authenticationUtils->getLastAuthenticationError(),
            'last_username' => $authenticationUtils->getLastUsername()
        ]);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(AuthenticationUtils $authenticationUtils): void
    {
        
    }

    #[Route('/register', name: 'app_register', methods: [REQUEST::METHOD_GET, REQUEST::METHOD_POST])]
    public function register(EntityManagerInterface $em, Request $request, UserPasswordHasherInterface $userPasswordHasherInterface): Response
    {

        $data = $request->request->all();
        $error = false;

        if($request->isMethod(REQUEST::METHOD_POST) && $this->isCsrfTokenValid('register', $data['register_csrf_token'])) {
            if($data['register_password'] === $data['confirm_password']) { 
                if($error === false) {
                    $user = new User();
                    $user->setUsername($data['register_username']);
                    $user->setPassword($userPasswordHasherInterface->hashPassword($user, $data['register_password']));
                    $em->persist($user);
                    $em->flush();
                    return $this->redirectToRoute('app_login');
                }
            } else $error = 'les deux mot de passe ne correspondent pas !';
        }

        return $this->render('user/register.html.twig', [
            'error' => $error,
            'old' => $data
        ]);
    }
}
